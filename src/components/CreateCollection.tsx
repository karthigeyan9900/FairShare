import { useState } from 'react';
import type { Collection, Group } from '../types/app';

interface CreateCollectionProps {
  groups: Group[];
  existingCollection?: Collection;
  onSave: (collection: Collection) => void;
  onCancel: () => void;
}

export default function CreateCollection({
  groups,
  existingCollection,
  onSave,
  onCancel,
}: CreateCollectionProps) {
  const [name, setName] = useState(existingCollection?.name || '');
  const [icon, setIcon] = useState(existingCollection?.icon || '📊');
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>(
    existingCollection?.groupIds || []
  );
  const [errors, setErrors] = useState<string[]>([]);

  const iconOptions = [
    '📊', '🇻🇳', '🏖️', '🏔️', '🌆', '🏠', '✈️', '🎉',
    '🍔', '🎓', '💼', '🏃', '🎮', '🎬', '🎵', '📚',
    '🚗', '🏕️', '⛺', '🎿', '🏊', '🚴', '⚽', '🎾',
    '🏀', '🎨', '🎭', '🎪', '🎯', '🎲', '🎰', '🎳'
  ];

  const toggleGroupSelection = (groupId: string) => {
    setSelectedGroupIds((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
    setErrors([]); // Clear errors when user makes changes
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const validationErrors: string[] = [];
    if (!name.trim()) {
      validationErrors.push('Collection name is required');
    }
    if (selectedGroupIds.length === 0) {
      validationErrors.push('At least one group must be selected');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Create or update collection
    const collection: Collection = {
      id: existingCollection?.id || Date.now().toString(),
      name: name.trim(),
      icon,
      groupIds: selectedGroupIds,
      createdAt: existingCollection?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    onSave(collection);
  };

  const selectedGroups = groups.filter((g) => selectedGroupIds.includes(g.id));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full my-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-8 rounded-t-3xl text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold">
              {existingCollection ? 'Edit Collection' : 'Create New Collection'}
            </h2>
            <button
              onClick={onCancel}
              className="text-white/80 hover:text-white text-3xl leading-none"
            >
              ×
            </button>
          </div>
          <p className="text-purple-100">
            Combine multiple groups to see aggregated insights
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {/* Errors */}
          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-red-800 font-semibold mb-2">Please fix the following:</p>
              <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Preview */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
              <span className="text-5xl">{icon}</span>
            </div>
          </div>

          {/* Icon Picker */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Collection Icon
            </label>
            <div className="grid grid-cols-8 gap-2 p-4 bg-gray-50 rounded-xl border-2 border-gray-200 max-h-48 overflow-y-auto">
              {iconOptions.map((iconOption) => (
                <button
                  key={iconOption}
                  type="button"
                  onClick={() => setIcon(iconOption)}
                  className={`w-10 h-10 text-2xl rounded-lg transition-all hover:scale-110 ${
                    icon === iconOption
                      ? 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg ring-2 ring-purple-400'
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  {iconOption}
                </button>
              ))}
            </div>
          </div>

          {/* Collection Name */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Collection Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors([]);
              }}
              placeholder="e.g., Vietnam 2025 Complete"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Group Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Groups * ({selectedGroupIds.length} selected)
            </label>
            {groups.length === 0 ? (
              <div className="p-6 bg-gray-50 rounded-xl text-center text-gray-500">
                <p className="mb-2">No groups available</p>
                <p className="text-sm">Create some groups first to add them to a collection</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                {groups.map((group) => {
                  const isSelected = selectedGroupIds.includes(group.id);
                  return (
                    <label
                      key={group.id}
                      className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300'
                          : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleGroupSelection(group.id)}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                      />
                      <div className="flex items-center gap-3 flex-1">
                        {group.icon && (
                          <span className="text-2xl">{group.icon}</span>
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{group.name}</p>
                          <p className="text-sm text-gray-500">
                            {group.members.length} members • {group.expenses.length} expenses
                          </p>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Groups Preview */}
          {selectedGroups.length > 0 && (
            <div className="mb-6 p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
              <p className="text-sm font-semibold text-purple-900 mb-3">
                Selected Groups ({selectedGroups.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedGroups.map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-purple-200"
                  >
                    {group.icon && <span className="text-lg">{group.icon}</span>}
                    <span className="text-sm font-medium text-gray-900">
                      {group.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleGroupSelection(group.id)}
                      className="text-gray-400 hover:text-red-500 text-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:shadow-lg font-semibold transition-all"
            >
              {existingCollection ? 'Update Collection' : 'Create Collection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
