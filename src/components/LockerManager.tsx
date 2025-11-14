import { useState } from 'react';
import type { Group, Deposit } from '../types/app';
import { formatCurrency } from '../utils/currency';

interface LockerManagerProps {
  group: Group;
  onUpdate: (group: Group) => void;
}

export default function LockerManager({ group, onUpdate }: LockerManagerProps) {
  const [amount, setAmount] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [commonPoolAmount, setCommonPoolAmount] = useState('');
  const [editingBudgets, setEditingBudgets] = useState<Record<string, string>>({});

  const addCommonPool = () => {
    if (!commonPoolAmount) return;
    
    const total = parseFloat(commonPoolAmount);
    const budgetPerPerson = total / group.members.length;
    
    // Update each member's budget
    const updatedMembers = group.members.map(member => ({
      ...member,
      budget: (member.budget || 0) + budgetPerPerson
    }));
    
    // Add deposit to locker
    const deposit: Deposit = {
      id: Date.now().toString(),
      memberId: 'common-pool',
      amount: total,
      date: new Date()
    };
    
    const updatedGroup = {
      ...group,
      members: updatedMembers,
      locker: {
        ...group.locker,
        totalAmount: group.locker.totalAmount + total,
        deposits: [...group.locker.deposits, deposit]
      }
    };
    
    onUpdate(updatedGroup);
    setCommonPoolAmount('');
  };

  const addDeposit = () => {
    if (!amount || !selectedMember) return;
    
    const deposit: Deposit = {
      id: Date.now().toString(),
      memberId: selectedMember,
      amount: parseFloat(amount),
      date: new Date()
    };
    
    const updatedGroup = {
      ...group,
      locker: {
        ...group.locker,
        totalAmount: group.locker.totalAmount + parseFloat(amount),
        deposits: [...group.locker.deposits, deposit]
      }
    };
    
    onUpdate(updatedGroup);
    setAmount('');
    setSelectedMember('');
  };

  const getMemberName = (memberId: string) => {
    if (memberId === 'common-pool') return 'Common Pool (Split Equally)';
    return group.members.find(m => m.id === memberId)?.name || 'Unknown';
  };

  const deleteDeposit = (depositId: string) => {
    const deposit = group.locker.deposits.find(d => d.id === depositId);
    if (!deposit) return;

    if (!confirm('Are you sure you want to delete this deposit?')) return;

    // If it's a common pool deposit, also remove the budgets
    let updatedMembers = group.members;
    if (deposit.memberId === 'common-pool') {
      const budgetPerPerson = deposit.amount / group.members.length;
      updatedMembers = group.members.map(member => ({
        ...member,
        budget: Math.max(0, (member.budget || 0) - budgetPerPerson)
      }));
    }

    const updatedGroup = {
      ...group,
      members: updatedMembers,
      locker: {
        ...group.locker,
        totalAmount: group.locker.totalAmount - deposit.amount,
        deposits: group.locker.deposits.filter(d => d.id !== depositId)
      }
    };

    onUpdate(updatedGroup);
  };

  const updateMemberBudget = (memberId: string, newBudget: string) => {
    const budget = parseFloat(newBudget) || 0;
    const updatedMembers = group.members.map(m =>
      m.id === memberId ? { ...m, budget } : m
    );

    onUpdate({
      ...group,
      members: updatedMembers
    });

    setEditingBudgets({ ...editingBudgets, [memberId]: '' });
  };

  const totalWithdrawn = group.expenses.reduce((sum, expense) => {
    if (expense.paidBy === 'locker') {
      return sum + expense.amount;
    } else if (expense.paidBy === 'multiple' && expense.paidByMultiple) {
      const lockerContribution = expense.paidByMultiple.find(p => p.payerId === 'locker');
      return sum + (lockerContribution?.amount || 0);
    }
    return sum;
  }, 0);

  const remaining = group.locker.totalAmount - totalWithdrawn;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Cash Locker</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-700">Total Deposited</h3>
            <p className="text-2xl font-bold text-blue-900 mt-1">
              {formatCurrency(group.locker.totalAmount, group.currency)}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-red-700">Total Withdrawn</h3>
            <p className="text-2xl font-bold text-red-900 mt-1">
              {formatCurrency(totalWithdrawn, group.currency)}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-green-700">Remaining</h3>
            <p className="text-2xl font-bold text-green-900 mt-1">
              {formatCurrency(remaining, group.currency)}
            </p>
          </div>
        </div>

        <div className="border-t pt-6 space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Common Pool (Split Equally as Budget)</h3>
            <p className="text-sm text-gray-600 mb-4">
              Add money that will be split equally among all members and set as their personal budget
            </p>
            <div className="flex gap-4">
              <input
                type="number"
                value={commonPoolAmount}
                onChange={(e) => setCommonPoolAmount(e.target.value)}
                placeholder="Total amount"
                className="flex-1 px-4 py-2 border rounded-md"
              />
              <button
                onClick={addCommonPool}
                disabled={!commonPoolAmount}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300"
              >
                Add & Split Budget
              </button>
            </div>
            {commonPoolAmount && (
              <p className="text-sm text-gray-600 mt-2">
                Each person will get: {formatCurrency(parseFloat(commonPoolAmount) / group.members.length, group.currency)}
              </p>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-4">Individual Deposit</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                className="px-4 py-2 border rounded-md"
              >
                <option value="">Select Member</option>
                {group.members.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                className="px-4 py-2 border rounded-md"
              />
              <button
                onClick={addDeposit}
                disabled={!amount || !selectedMember}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300"
              >
                Add Deposit
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Current Budgets</h3>
        <p className="text-sm text-gray-600 mb-4">
          You can manually edit individual budgets or use Common Pool to split equally
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {group.members.map(member => (
            <div key={member.id} className="p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-gray-900">{member.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={editingBudgets[member.id] ?? member.budget}
                  onChange={(e) => setEditingBudgets({ ...editingBudgets, [member.id]: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded-md"
                  placeholder="Budget amount"
                />
                <button
                  onClick={() => updateMemberBudget(member.id, editingBudgets[member.id] || member.budget.toString())}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {group.locker.deposits.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Deposit History</h3>
          <div className="space-y-2">
            {group.locker.deposits.map(deposit => (
              <div key={deposit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100">
                <div className="flex-1">
                  <span className="font-medium">{getMemberName(deposit.memberId)}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    {new Date(deposit.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-green-600">
                    +{formatCurrency(deposit.amount, group.currency)}
                  </span>
                  <button
                    onClick={() => deleteDeposit(deposit.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
