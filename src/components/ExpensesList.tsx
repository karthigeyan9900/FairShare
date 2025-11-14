import { useState } from 'react';
import type { Group, Expense } from '../types/app';
import AddExpense from './AddExpense';
import { formatCurrency } from '../utils/currency';

interface ExpensesListProps {
  group: Group;
  onUpdate: (group: Group) => void;
}

export default function ExpensesList({ group, onUpdate }: ExpensesListProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedExpense, setExpandedExpense] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const handleAddExpense = (expense: Expense) => {
    const updatedGroup = {
      ...group,
      expenses: [...group.expenses, expense]
    };
    onUpdate(updatedGroup);
    setShowAddForm(false);
  };

  const getMemberName = (id: string) => {
    return group.members.find(m => m.id === id)?.name || 'Unknown';
  };

  const getPaidByLabel = (expense: Expense) => {
    if (expense.paidBy === 'locker') return '🔒 Cash Locker';
    if (expense.paidBy === 'multiple') {
      const count = expense.paidByMultiple?.length || 0;
      return `👥 Multiple (${count} payers)`;
    }
    return getMemberName(expense.paidBy);
  };

  const toggleExpense = (expenseId: string) => {
    setExpandedExpense(expandedExpense === expenseId ? null : expenseId);
  };

  const handleDelete = (expenseId: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    
    const updatedGroup = {
      ...group,
      expenses: group.expenses.filter(e => e.id !== expenseId)
    };
    onUpdate(updatedGroup);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowAddForm(true);
  };

  const handleUpdate = (updatedExpense: Expense) => {
    const updatedGroup = {
      ...group,
      expenses: group.expenses.map(e => 
        e.id === updatedExpense.id ? updatedExpense : e
      )
    };
    onUpdate(updatedGroup);
    setShowAddForm(false);
    setEditingExpense(null);
  };

  if (showAddForm) {
    return (
      <AddExpense
        group={group}
        onAdd={editingExpense ? handleUpdate : handleAddExpense}
        onCancel={() => {
          setShowAddForm(false);
          setEditingExpense(null);
        }}
        existingExpense={editingExpense}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Expenses
          </h2>
          <p className="text-sm text-gray-500 mt-1">{group.expenses.length} total expenses</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold flex items-center gap-2"
        >
          <span className="text-xl">+</span> Add Expense
        </button>
      </div>

      {group.expenses.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-16 text-center border border-gray-100">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">📝</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No expenses yet</h3>
          <p className="text-gray-500 mb-6">Start by adding your first expense</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
          >
            ✨ Add Your First Expense
          </button>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          {group.expenses.map((expense, index) => (
            <div 
              key={expense.id} 
              className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Main Row - Clickable */}
              <div
                onClick={() => toggleExpense(expense.id)}
                className="p-5 cursor-pointer"
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Left: Name and Date */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{expense.name}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(expense.date).toLocaleDateString()} • {expense.category}
                    </p>
                  </div>
                  
                  {/* Middle: Paid By */}
                  <div className="hidden md:block">
                    <span className="text-sm px-4 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full font-medium border border-blue-200">
                      {getPaidByLabel(expense)}
                    </span>
                  </div>
                  
                  {/* Right: Amount and Arrow */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {expense.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">{group.currency}</p>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      expandedExpense === expense.id 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rotate-180' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      <span className="text-sm">▼</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedExpense === expense.id && (
                <div className="border-t bg-gradient-to-b from-gray-50 to-white p-6">
                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 mb-6">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(expense);
                      }}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 text-sm font-semibold"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(expense.id);
                      }}
                      className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 text-sm font-semibold"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Payment Details */}
                    <div className="bg-white rounded-lg p-4 border">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-green-600">💰</span>
                        Who Paid
                      </h4>
                      <div className="space-y-2">
                        {expense.paidBy === 'multiple' && expense.paidByMultiple ? (
                          expense.paidByMultiple.map((payment, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                              <span className="text-sm font-medium">
                                {payment.payerId === 'locker' ? '🔒 Cash Locker' : getMemberName(payment.payerId)}
                              </span>
                              <span className="text-sm font-bold text-green-700">
                                +{formatCurrency(payment.amount, group.currency)}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                            <span className="text-sm font-medium">{getPaidByLabel(expense)}</span>
                            <span className="text-sm font-bold text-green-700">
                              +{formatCurrency(expense.amount, group.currency)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Split Details */}
                    <div className="bg-white rounded-lg p-4 border">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-red-600">📊</span>
                        Split ({expense.splitType.charAt(0).toUpperCase() + expense.splitType.slice(1)})
                      </h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {expense.splits.map((split, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                            <span className="text-sm font-medium">
                              {getMemberName(split.memberId)}
                            </span>
                            <div className="text-right">
                              <span className="text-sm font-bold text-red-700">
                                -{formatCurrency(split.amount, group.currency)}
                              </span>
                              {split.ratio && (
                                <span className="text-xs text-gray-500 block">
                                  Ratio: {split.ratio}
                                </span>
                              )}
                              {split.shares && (
                                <span className="text-xs text-gray-500 block">
                                  Shares: {split.shares}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t flex justify-between items-center">
                        <span className="font-semibold text-gray-700">Total:</span>
                        <span className="font-bold text-gray-900">
                          {formatCurrency(expense.splits.reduce((sum, s) => sum + s.amount, 0), group.currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
