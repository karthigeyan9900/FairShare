import { useState } from 'react';
import type { CollectionStats as Stats, Group } from '../types/app';
import { formatCurrency, convertCurrency, getUniqueCurrencies, type Currency, currencyConfig } from '../utils/currency';

interface CollectionStatsProps {
  stats: Stats;
  groups: Group[];
}

export default function CollectionStats({ stats, groups }: CollectionStatsProps) {
  const currencies = getUniqueCurrencies(groups.map(g => g.currency));
  const [displayCurrency, setDisplayCurrency] = useState<Currency | 'multi'>(
    currencies.length === 1 ? currencies[0] : 'multi'
  );

  // Calculate totals by currency
  const totalsByCurrency = groups.reduce((acc, group) => {
    const groupTotal = group.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const groupLocker = group.expenses
      .filter(exp => exp.paidBy === 'locker')
      .reduce((sum, exp) => sum + exp.amount, 0);
    
    if (!acc[group.currency]) {
      acc[group.currency] = { total: 0, locker: 0, personal: 0 };
    }
    acc[group.currency].total += groupTotal;
    acc[group.currency].locker += groupLocker;
    acc[group.currency].personal += (groupTotal - groupLocker);
    
    return acc;
  }, {} as Record<Currency, { total: number; locker: number; personal: number }>);

  // Convert all to display currency if needed
  const getDisplayTotal = (type: 'total' | 'locker' | 'personal'): string => {
    if (displayCurrency === 'multi') {
      // Show all currencies
      return Object.entries(totalsByCurrency)
        .map(([curr, amounts]) => formatCurrency(amounts[type], curr as Currency))
        .join(' + ');
    } else {
      // Convert all to selected currency
      const total = Object.entries(totalsByCurrency).reduce((sum, [curr, amounts]) => {
        return sum + convertCurrency(amounts[type], curr as Currency, displayCurrency);
      }, 0);
      return formatCurrency(total, displayCurrency);
    }
  };

  return (
    <div>
      {/* Currency Toggle */}
      {currencies.length > 1 && (
        <div className="mb-6 flex items-center justify-between bg-white rounded-xl p-4 shadow-md border-2 border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">View in:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setDisplayCurrency('multi')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  displayCurrency === 'multi'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Multi-Currency
              </button>
              {currencies.map(curr => (
                <button
                  key={curr}
                  onClick={() => setDisplayCurrency(curr)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    displayCurrency === curr
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {currencyConfig[curr].symbol} {curr}
                </button>
              ))}
            </div>
          </div>
          {displayCurrency !== 'multi' && (
            <span className="text-xs text-gray-500">
              Converted using current exchange rates
            </span>
          )}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Expenses */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-purple-100 text-sm mb-2">Total Expenses</p>
          <p className="text-3xl font-bold mb-1 break-words">{getDisplayTotal('total')}</p>
          <p className="text-purple-200 text-sm">{stats.expenseCount} transactions</p>
          {displayCurrency === 'multi' && currencies.length > 1 && (
            <p className="text-purple-200 text-xs mt-2">
              {currencies.length} currencies
            </p>
          )}
        </div>

        {/* Locker Spending */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
          <p className="text-gray-500 text-sm mb-2">🔒 Locker Spending</p>
          <p className="text-3xl font-bold text-gray-900 mb-1 break-words">
            {getDisplayTotal('locker')}
          </p>
          <p className="text-gray-500 text-sm">
            {stats.totalExpenses > 0
              ? `${((stats.totalLockerSpending / stats.totalExpenses) * 100).toFixed(1)}% of total`
              : '0% of total'}
          </p>
        </div>

        {/* Personal Spending */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
          <p className="text-gray-500 text-sm mb-2">👤 Personal Spending</p>
          <p className="text-3xl font-bold text-gray-900 mb-1 break-words">
            {getDisplayTotal('personal')}
          </p>
          <p className="text-gray-500 text-sm">
            {stats.totalExpenses > 0
              ? `${((stats.totalPersonalSpending / stats.totalExpenses) * 100).toFixed(1)}% of total`
              : '0% of total'}
          </p>
        </div>
      </div>

      {/* Currency Breakdown (when in multi-currency mode) */}
      {displayCurrency === 'multi' && currencies.length > 1 && (
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Breakdown by Currency</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(totalsByCurrency).map(([curr, amounts]) => (
              <div key={curr} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{currencyConfig[curr as Currency].symbol}</span>
                  <span className="font-semibold text-gray-900">{curr}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-semibold">{formatCurrency(amounts.total, curr as Currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Locker:</span>
                    <span className="font-semibold">{formatCurrency(amounts.locker, curr as Currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Personal:</span>
                    <span className="font-semibold">{formatCurrency(amounts.personal, curr as Currency)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
