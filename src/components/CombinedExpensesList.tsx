import type { CombinedExpense } from '../types/app';
import { formatCurrency } from '../utils/currency';

interface CombinedExpensesListProps {
  expenses: CombinedExpense[];
  onExpenseClick: (groupId: string, expenseId: string) => void;
}

export default function CombinedExpensesList({
  expenses,
  onExpenseClick,
}: CombinedExpensesListProps) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No expenses found</p>
        <p className="text-sm mt-2">Add expenses to your groups to see them here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <button
          key={`${expense.groupId}-${expense.id}`}
          onClick={() => onExpenseClick(expense.groupId, expense.id)}
          className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all border border-gray-200 hover:border-purple-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">{expense.name}</span>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                  {expense.groupIcon} {expense.groupName}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{new Date(expense.date).toLocaleDateString()}</span>
                <span>•</span>
                <span>{expense.category}</span>
                {expense.paidBy === 'locker' && (
                  <>
                    <span>•</span>
                    <span className="text-purple-600 font-medium">🔒 Locker</span>
                  </>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(expense.amount, expense.currency)}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
