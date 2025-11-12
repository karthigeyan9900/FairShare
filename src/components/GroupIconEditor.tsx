import { useState } from 'react';
import type { Group } from '../types/app';

interface GroupIconEditorProps {
  group: Group;
  onUpdate: (group: Group) => void;
}

export default function GroupIconEditor({ group, onUpdate }: GroupIconEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(group.icon || '✈️');

  const iconOptions = [
    '✈️', '🏖️', '🏔️', '🌆', '🏠', '👥', '🎉', '🍔', 
    '🎓', '💼', '🏃', '🎮', '🎬', '🎵', '📚', '🚗',
    '🏕️', '⛺', '🎿', '🏊', '🚴', '⚽', '🎾', '🏀',
    '🎨', '🎭', '🎪', '🎯', '🎲', '🎰', '🎳', '🎸'
  ];

  const handleSave = () => {
    onUpdate({ ...group, icon: selectedIcon });
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform cursor-pointer group relative"
        title="Click to change icon"
      >
        {group.icon ? (
          <span className="text-2xl">{group.icon}</span>
        ) : (
          group.name.charAt(0).toUpperCase()
        )}
        <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
          ✏️
        </span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Choose Group Icon</h3>
          <button
            onClick={() => setIsEditing(false)}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <span className="text-4xl">{selectedIcon}</span>
          </div>
        </div>

        <div className="grid grid-cols-8 gap-2 mb-6 max-h-64 overflow-y-auto p-2">
          {iconOptions.map(icon => (
            <button
              key={icon}
              onClick={() => setSelectedIcon(icon)}
              className={`w-10 h-10 text-2xl rounded-lg transition-all hover:scale-110 ${
                selectedIcon === icon 
                  ? 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg ring-2 ring-purple-400' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {icon}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsEditing(false)}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:shadow-lg font-medium"
          >
            Save Icon
          </button>
        </div>
      </div>
    </div>
  );
}
