import { useState } from 'react';
import type { Group } from '../types/app';
import { currencyConfig, type Currency } from '../utils/currency';

interface GroupCurrencyEditorProps {
  group: Group;
  onUpdate: (group: Group) => void;
}

export default function GroupCurrencyEditor({ group, onUpdate }: GroupCurrencyEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(group.currency);

  const handleSave = () => {
    onUpdate({ ...group, currency: selectedCurrency });
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all text-sm font-medium text-gray-700 group"
        title="Click to change currency"
      >
        <span className="text-lg">{currencyConfig[group.currency].symbol}</span>
        <span>{group.currency}</span>
        <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">✏️</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Change Currency</h3>
          <button
            onClick={() => setIsEditing(false)}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
          <p className="text-sm text-yellow-800">
            ⚠️ This will only change the currency label. Expense amounts will NOT be converted.
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Currency
          </label>
          <div className="space-y-2">
            {(Object.keys(currencyConfig) as Currency[]).map((curr) => (
              <button
                key={curr}
                onClick={() => setSelectedCurrency(curr)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  selectedCurrency === curr
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{currencyConfig[curr].symbol}</span>
                  <div className="text-left">
                    <p className="font-semibold">{currencyConfig[curr].name}</p>
                    <p className={`text-xs ${selectedCurrency === curr ? 'text-purple-200' : 'text-gray-500'}`}>
                      {curr}
                    </p>
                  </div>
                </div>
                {selectedCurrency === curr && <span className="text-xl">✓</span>}
              </button>
            ))}
          </div>
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
            Save Currency
          </button>
        </div>
      </div>
    </div>
  );
}
