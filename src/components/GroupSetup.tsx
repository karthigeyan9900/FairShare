import { useState } from 'react';
import type { Group, Member } from '../types/app';
import { currencyConfig, type Currency } from '../utils/currency';

interface GroupSetupProps {
  onGroupCreated: (group: Group) => void;
}

export default function GroupSetup({ onGroupCreated }: GroupSetupProps) {
  const [groupName, setGroupName] = useState('');
  const [groupIcon, setGroupIcon] = useState('✈️');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [memberName, setMemberName] = useState('');
  const [members, setMembers] = useState<Member[]>([]);

  const iconOptions = [
    '✈️', '🏖️', '🏔️', '🌆', '🏠', '👥', '🎉', '🍔', 
    '🎓', '💼', '🏃', '🎮', '🎬', '🎵', '📚', '🚗',
    '🏕️', '⛺', '🎿', '🏊', '🚴', '⚽', '🎾', '🏀'
  ];

  const addMember = () => {
    if (!memberName.trim()) return;
    
    const newMember: Member = {
      id: Date.now().toString(),
      name: memberName.trim(),
      budget: 0
    };
    
    setMembers([...members, newMember]);
    setMemberName('');
  };

  const removeMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const createGroup = () => {
    if (!groupName.trim() || members.length === 0) return;
    
    const group: Group = {
      id: Date.now().toString(),
      name: groupName.trim(),
      icon: groupIcon,
      currency,
      members,
      locker: {
        totalAmount: 0,
        deposits: []
      },
      expenses: [],
      createdAt: new Date()
    };
    
    onGroupCreated(group);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-4xl">{groupIcon}</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Create Expense Group
          </h2>
          <p className="text-gray-500">Start tracking expenses with your group</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Icon
            </label>
            <div className="grid grid-cols-8 gap-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
              {iconOptions.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setGroupIcon(icon)}
                  className={`w-10 h-10 text-2xl rounded-lg transition-all hover:scale-110 ${
                    groupIcon === icon 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg ring-2 ring-purple-400' 
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(currencyConfig).map(([code, config]) => (
                <option key={code} value={code}>
                  {config.symbol} {config.name} ({code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g., Vietnam Trip 2025"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Members
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addMember()}
                placeholder="Member name"
                className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addMember}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>

          {members.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Members ({members.length})
              </h3>
              <div className="space-y-2">
                {members.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">{member.name}</span>
                    <button
                      onClick={() => removeMember(member.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={createGroup}
            disabled={!groupName.trim() || members.length === 0}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-2xl disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed font-bold text-lg transition-all transform hover:scale-105"
          >
            ✨ Create Group
          </button>
        </div>
      </div>
    </div>
  );
}
