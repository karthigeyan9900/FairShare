import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { Group } from '../types/app';

interface SummaryDashboardProps {
  group: Group;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function SummaryDashboard({ group }: SummaryDashboardProps) {
  if (!group || !group.members || group.members.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <p className="text-gray-500 text-lg">No group data available</p>
      </div>
    );
  }

  const stats = useMemo(() => {
    // Calculate spending per person
    const memberStats = group.members.map(member => {
      // Calculate what they consumed (their share of expenses)
      let consumed = 0;
      
      group.expenses.forEach(expense => {
        const split = expense.splits.find(s => s.memberId === member.id);
        if (split) {
          consumed += split.amount;
        }
      });

      // Calculate what they paid personally (not from locker)
      let personallyPaid = 0;
      
      group.expenses.forEach(expense => {
        if (expense.paidBy === member.id) {
          personallyPaid += expense.amount;
        } else if (expense.paidBy === 'multiple' && expense.paidByMultiple) {
          const contribution = expense.paidByMultiple.find(p => p.payerId === member.id);
          if (contribution) {
            personallyPaid += contribution.amount;
          }
        }
      });

      const budget = member.budget;
      const remaining = budget - consumed;
      const percentUsed = budget > 0 ? (consumed / budget * 100) : 0;

      return {
        id: member.id,
        name: member.name,
        budget,
        consumed,
        personallyPaid,
        remaining,
        percentUsed,
        isOverBudget: remaining < 0
      };
    });

    // Total stats
    const totalBudget = memberStats.reduce((sum, m) => sum + m.budget, 0);
    const totalConsumed = memberStats.reduce((sum, m) => sum + m.consumed, 0);
    const totalPaid = memberStats.reduce((sum, m) => sum + m.personallyPaid, 0);

    // Locker stats
    const lockerDeposited = group.locker.totalAmount;
    const lockerWithdrawn = group.expenses.reduce((sum, expense) => {
      if (expense.paidBy === 'locker') {
        return sum + expense.amount;
      } else if (expense.paidBy === 'multiple' && expense.paidByMultiple) {
        const lockerContribution = expense.paidByMultiple.find(p => p.payerId === 'locker');
        return sum + (lockerContribution?.amount || 0);
      }
      return sum;
    }, 0);

    // Category breakdown
    const categoryStats = group.expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const categoryData = Object.entries(categoryStats).map(([name, value]) => ({
      name,
      value
    }));

    return {
      memberStats,
      totalBudget,
      totalConsumed,
      totalPaid,
      lockerDeposited,
      lockerWithdrawn,
      categoryData
    };
  }, [group]);

  // Show message if no budgets set
  const hasBudgets = stats.memberStats.some(m => m.budget > 0);
  const hasExpenses = group.expenses.length > 0;

  if (!hasBudgets && !hasExpenses) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Welcome to Summary Dashboard</h2>
        <p className="text-gray-500 mb-6">
          To see your budget and spending analysis, you need to:
        </p>
        <div className="space-y-3 text-left max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <span className="text-2xl">1️⃣</span>
            <div>
              <p className="font-semibold">Set Budgets</p>
              <p className="text-sm text-gray-600">Go to Cash Locker → Add Common Pool to set budgets</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">2️⃣</span>
            <div>
              <p className="font-semibold">Add Expenses</p>
              <p className="text-sm text-gray-600">Go to Expenses → Add your first expense</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-blue-700">Total Budget</h3>
          <p className="text-2xl font-bold text-blue-900 mt-2">
            {(stats.totalBudget || 0).toLocaleString()} VND
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-purple-700">Total Consumed</h3>
          <p className="text-2xl font-bold text-purple-900 mt-2">
            {(stats.totalConsumed || 0).toLocaleString()} VND
          </p>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-green-700">Locker Balance</h3>
          <p className="text-2xl font-bold text-green-900 mt-2">
            {((stats.lockerDeposited || 0) - (stats.lockerWithdrawn || 0)).toLocaleString()} VND
          </p>
        </div>
        <div className="bg-orange-50 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-orange-700">Total Expenses</h3>
          <p className="text-2xl font-bold text-orange-900 mt-2">
            {group.expenses?.length || 0}
          </p>
        </div>
      </div>

      {/* Budget vs Spending Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-6">Budget vs Spending by Person</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={stats.memberStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => value.toLocaleString() + ' VND'} />
            <Legend />
            <Bar dataKey="budget" fill="#3B82F6" name="Budget" />
            <Bar dataKey="consumed" fill="#EF4444" name="Consumed" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Individual Member Cards */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-6">Individual Budget Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.memberStats.map((member, index) => (
            <div key={member.id} className="border-2 rounded-lg p-4" style={{ borderColor: COLORS[index % COLORS.length] }}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold">{member.name}</h4>
                {member.isOverBudget && (
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                    Over Budget
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Budget:</span>
                  <span className="font-semibold">{(member.budget || 0).toLocaleString()} VND</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Consumed:</span>
                  <span className="font-semibold text-red-600">{(member.consumed || 0).toLocaleString()} VND</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Remaining:</span>
                  <span className={`font-semibold ${member.isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                    {(member.remaining || 0).toLocaleString()} VND
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Paid Personally:</span>
                  <span className="font-semibold text-blue-600">{(member.personallyPaid || 0).toLocaleString()} VND</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span>Budget Usage</span>
                  <span className={member.isOverBudget ? 'text-red-600 font-semibold' : ''}>
                    {member.percentUsed.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      member.isOverBudget 
                        ? 'bg-red-600' 
                        : member.percentUsed > 80 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(member.percentUsed, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      {stats.categoryData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-6">Spending by Category</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => value.toLocaleString() + ' VND'} />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-2">
              {stats.categoryData.map((cat, index) => (
                <div key={cat.name} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium">{cat.name}</span>
                  </div>
                  <span className="font-semibold">{cat.value.toLocaleString()} VND</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
