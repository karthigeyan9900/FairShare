import { useState, useMemo } from 'react';
import type { Collection, Group } from '../types/app';
import { calculateCollectionStats, getCombinedExpenses } from '../utils/collectionAggregation';
import GroupBreakdown from './GroupBreakdown';
import CombinedExpensesList from './CombinedExpensesList';
import CollectionStats from './CollectionStats';
import CurrencyRatesDisplay from './CurrencyRatesDisplay';
import { getUniqueCurrencies, convertCurrency, formatCurrency, type Currency, currencyConfig } from '../utils/currency';

interface CollectionDashboardProps {
  collection: Collection;
  groups: Group[];
  onNavigateToGroup: (groupId: string) => void;
  onEditCollection: () => void;
  onBack: () => void;
}

export default function CollectionDashboard({
  collection,
  groups,
  onNavigateToGroup,
  onEditCollection,
  onBack,
}: CollectionDashboardProps) {
  const [activeView, setActiveView] = useState<'overview' | 'expenses' | 'members'>('overview');

  // Calculate stats (memoized for performance)
  const stats = useMemo(
    () => calculateCollectionStats(collection, groups),
    [collection, groups]
  );

  const combinedExpenses = useMemo(
    () => getCombinedExpenses(collection, groups),
    [collection, groups]
  );

  const collectionGroups = groups.filter((g) => collection.groupIds.includes(g.id));
  
  // Get unique currencies from collection groups
  const currencies = useMemo(
    () => getUniqueCurrencies(collectionGroups.map(g => g.currency)),
    [collectionGroups]
  );
  
  // Currency display state for Members tab
  const [memberDisplayCurrency, setMemberDisplayCurrency] = useState<Currency | 'multi'>(
    currencies.length === 1 ? currencies[0] : 'multi'
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Currency Rates Display */}
      <CurrencyRatesDisplay />
      
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="text-gray-400 hover:text-gray-600 text-2xl"
                title="Back to collections"
              >
                ←
              </button>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">{collection.icon || '📊'}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{collection.name}</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {collectionGroups.length} group{collectionGroups.length !== 1 ? 's' : ''} • {stats.expenseCount} expense{stats.expenseCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <button
              onClick={onEditCollection}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold flex items-center gap-2"
            >
              <span>✏️</span>
              <span>Edit</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveView('overview')}
              className={`py-4 px-2 border-b-2 font-semibold transition-colors ${
                activeView === 'overview'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveView('expenses')}
              className={`py-4 px-2 border-b-2 font-semibold transition-colors ${
                activeView === 'expenses'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              All Expenses ({stats.expenseCount})
            </button>
            <button
              onClick={() => setActiveView('members')}
              className={`py-4 px-2 border-b-2 font-semibold transition-colors ${
                activeView === 'members'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Members ({stats.memberBreakdown.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        {activeView === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <CollectionStats stats={stats} groups={collectionGroups} />

            {/* Group Breakdown */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Groups in this Collection</h2>
              <GroupBreakdown
                contributions={stats.groupBreakdown}
                onGroupClick={onNavigateToGroup}
              />
            </div>

            {/* Category Breakdown */}
            {stats.categoryBreakdown.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Spending by Category</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Note: Amounts shown in original currencies. Use Collection Stats above for converted totals.
                </p>
                <div className="space-y-3">
                  {stats.categoryBreakdown.map((category) => {
                    const percentage = (category.amount / stats.totalExpenses) * 100;
                    // Get category amounts by currency
                    const categoryByCurrency = combinedExpenses
                      .filter(exp => exp.category === category.category)
                      .reduce((acc, exp) => {
                        acc[exp.currency] = (acc[exp.currency] || 0) + exp.amount;
                        return acc;
                      }, {} as Record<Currency, number>);
                    
                    return (
                      <div key={category.category}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{category.category}</span>
                          <div className="text-right">
                            <div className="text-gray-600 text-sm">
                              {Object.entries(categoryByCurrency).map(([curr, amt], idx) => (
                                <span key={curr}>
                                  {idx > 0 && ' + '}
                                  {curr === 'INR' && '₹'}
                                  {curr === 'VND' && '₫'}
                                  {curr === 'USD' && '$'}
                                  {curr === 'MYR' && 'RM'}
                                  {amt.toLocaleString()}
                                </span>
                              ))}
                            </div>
                            <div className="text-xs text-gray-500">
                              {category.count} expense{category.count !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-indigo-600 h-3 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {activeView === 'expenses' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Expenses</h2>
            <CombinedExpensesList
              expenses={combinedExpenses}
              onExpenseClick={onNavigateToGroup}
            />
          </div>
        )}

        {activeView === 'members' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Member Spending</h2>
            
            {/* Currency Toggle */}
            {currencies.length > 1 && (
              <div className="mb-6 flex items-center justify-between bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700">View in:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setMemberDisplayCurrency('multi')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        memberDisplayCurrency === 'multi'
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      Multi-Currency
                    </button>
                    {currencies.map(curr => (
                      <button
                        key={curr}
                        onClick={() => setMemberDisplayCurrency(curr)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          memberDisplayCurrency === curr
                            ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                      >
                        {currencyConfig[curr].symbol} {curr}
                      </button>
                    ))}
                  </div>
                </div>
                {memberDisplayCurrency !== 'multi' && (
                  <span className="text-xs text-gray-500">
                    Converted using current exchange rates
                  </span>
                )}
              </div>
            )}
            
            <div className="space-y-6">
              {stats.memberBreakdown.map((member) => {
                // Calculate total by currency for this member
                const memberByCurrency = member.groupBreakdown.reduce((acc, gb) => {
                  const group = collectionGroups.find(g => g.id === gb.groupId);
                  if (group) {
                    acc[group.currency] = (acc[group.currency] || 0) + gb.amount;
                  }
                  return acc;
                }, {} as Record<Currency, number>);
                
                // Calculate display total based on selected currency
                const getDisplayTotal = (): string => {
                  if (memberDisplayCurrency === 'multi') {
                    // Show all currencies
                    return Object.entries(memberByCurrency)
                      .map(([curr, amt]) => formatCurrency(amt, curr as Currency))
                      .join(' + ');
                  } else {
                    // Convert all to selected currency
                    const total = Object.entries(memberByCurrency).reduce((sum, [curr, amt]) => {
                      return sum + convertCurrency(amt, curr as Currency, memberDisplayCurrency);
                    }, 0);
                    return formatCurrency(total, memberDisplayCurrency);
                  }
                };
                
                return (
                  <div key={member.memberName} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                          {member.memberName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{member.memberName}</h3>
                          <p className="text-sm text-gray-500">Total Spent</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900 break-words">
                          {getDisplayTotal()}
                        </div>
                      </div>
                    </div>
                    <div className="ml-15 space-y-2">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Breakdown by Group:</p>
                      {member.groupBreakdown.map((gb) => {
                        const group = collectionGroups.find(g => g.id === gb.groupId);
                        if (!group) return null;
                        
                        // Display amount in selected currency or original
                        const displayAmount = memberDisplayCurrency === 'multi'
                          ? formatCurrency(gb.amount, group.currency)
                          : formatCurrency(
                              convertCurrency(gb.amount, group.currency, memberDisplayCurrency),
                              memberDisplayCurrency
                            );
                        
                        return (
                          <div key={gb.groupId} className="flex items-center justify-between py-2 px-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-700">{gb.groupName}</span>
                              {memberDisplayCurrency !== 'multi' && group.currency !== memberDisplayCurrency && (
                                <span className="text-xs text-gray-500">
                                  ({formatCurrency(gb.amount, group.currency)})
                                </span>
                              )}
                            </div>
                            <span className="text-sm font-semibold text-gray-900">
                              {displayAmount}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
