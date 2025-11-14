import type { Collection, Group } from '../types/app';
import { calculateCollectionStats } from '../utils/collectionAggregation';

interface CollectionsListProps {
  collections: Collection[];
  groups: Group[];
  onSelectCollection: (collectionId: string) => void;
  onCreateCollection: () => void;
  onDeleteCollection: (collectionId: string) => void;
}

export default function CollectionsList({
  collections,
  groups,
  onSelectCollection,
  onCreateCollection,
  onDeleteCollection,
}: CollectionsListProps) {
  // Empty state
  if (collections.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-5xl">📊</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">No Collections Yet</h2>
          <p className="text-gray-600 mb-8">
            Create your first collection to combine related groups and see aggregated insights
          </p>
          <button
            onClick={onCreateCollection}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 font-semibold text-lg"
          >
            ➕ Create First Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Collections</h1>
            <p className="text-gray-600">
              Manage and view aggregated insights across multiple groups
            </p>
          </div>
          <button
            onClick={onCreateCollection}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold flex items-center gap-2"
          >
            <span className="text-xl">➕</span>
            <span>New Collection</span>
          </button>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => {
            const stats = calculateCollectionStats(collection, groups);
            const collectionGroups = groups.filter((g) =>
              collection.groupIds.includes(g.id)
            );

            return (
              <div
                key={collection.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-gray-100 hover:border-purple-200 overflow-hidden group"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 text-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-4xl">
                        {collection.icon || '📊'}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCollection(collection.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-white/80 hover:text-white text-lg"
                      title="Delete collection"
                    >
                      🗑️
                    </button>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{collection.name}</h3>
                  <p className="text-purple-100 text-sm">
                    {collectionGroups.length} group{collectionGroups.length !== 1 ? 's' : ''} • {stats.expenseCount} expense{stats.expenseCount !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Total Spending */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-1">Total Spending</p>
                    <p className="text-3xl font-bold text-gray-900">
                      ${stats.totalExpenses.toLocaleString()}
                    </p>
                  </div>

                  {/* Breakdown */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">🔒 Locker</p>
                      <p className="text-lg font-semibold text-gray-900">
                        ${stats.totalLockerSpending.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">👤 Personal</p>
                      <p className="text-lg font-semibold text-gray-900">
                        ${stats.totalPersonalSpending.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Groups in Collection */}
                  {collectionGroups.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Groups</p>
                      <div className="flex flex-wrap gap-2">
                        {collectionGroups.slice(0, 3).map((group) => (
                          <div
                            key={group.id}
                            className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-xs"
                          >
                            {group.icon && <span>{group.icon}</span>}
                            <span className="text-gray-700 font-medium">
                              {group.name}
                            </span>
                          </div>
                        ))}
                        {collectionGroups.length > 3 && (
                          <div className="px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-600">
                            +{collectionGroups.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* View Button */}
                  <button
                    onClick={() => onSelectCollection(collection.id)}
                    className="w-full py-3 bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 rounded-xl hover:from-purple-100 hover:to-indigo-100 transition-all font-semibold border border-purple-200"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
