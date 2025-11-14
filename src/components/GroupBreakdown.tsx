import type { GroupContribution } from '../types/app';
import { formatCurrency } from '../utils/currency';

interface GroupBreakdownProps {
  contributions: GroupContribution[];
  onGroupClick: (groupId: string) => void;
}

export default function GroupBreakdown({ contributions, onGroupClick }: GroupBreakdownProps) {
  if (contributions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No groups in this collection</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {contributions.map((contribution) => (
        <button
          key={contribution.groupId}
          onClick={() => onGroupClick(contribution.groupId)}
          className="w-full text-left"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              {contribution.groupIcon && (
                <span className="text-2xl">{contribution.groupIcon}</span>
              )}
              <div>
                <p className="font-semibold text-gray-900">{contribution.groupName}</p>
                <p className="text-sm text-gray-500">
                  {contribution.expenseCount} expense{contribution.expenseCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(contribution.totalExpenses, contribution.currency)}
              </p>
              <p className="text-sm text-gray-500">{contribution.percentage.toFixed(1)}%</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-600 h-3 rounded-full transition-all"
              style={{ width: `${contribution.percentage}%` }}
            />
          </div>
        </button>
      ))}
    </div>
  );
}
