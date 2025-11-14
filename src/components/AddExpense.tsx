import { useState } from 'react';
import type { Group, Expense, ExpenseSplit, SplitType } from '../types/app';
import { getCurrencySymbol } from '../utils/currency';

interface AddExpenseProps {
  group: Group;
  onAdd: (expense: Expense) => void;
  onCancel: () => void;
  existingExpense?: Expense | null;
}

export default function AddExpense({ group, onAdd, onCancel, existingExpense }: AddExpenseProps) {
  const [name, setName] = useState(existingExpense?.name || '');
  const [amount, setAmount] = useState(existingExpense?.amount.toString() || '');
  const [date, setDate] = useState(
    existingExpense 
      ? new Date(existingExpense.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  );
  const [category, setCategory] = useState(existingExpense?.category || 'General');
  const [paidBy, setPaidBy] = useState<'locker' | 'multiple' | string>(existingExpense?.paidBy || 'locker');
  const [multiplePayments, setMultiplePayments] = useState<Record<string, string>>(
    existingExpense?.paidByMultiple?.reduce((acc, p) => ({ ...acc, [p.payerId]: p.amount.toString() }), {}) || {}
  );
  const [splitType, setSplitType] = useState<SplitType>(existingExpense?.splitType || 'equal');
  const [selectedMembers, setSelectedMembers] = useState<string[]>(
    existingExpense?.splits.map(s => s.memberId) || group.members.map(m => m.id)
  );
  const [manualSplits, setManualSplits] = useState<Record<string, string>>(
    existingExpense?.splits.reduce((acc, s) => ({ ...acc, [s.memberId]: s.amount.toString() }), {}) || {}
  );
  const [ratios, setRatios] = useState<Record<string, string>>(
    existingExpense?.splits.reduce((acc, s) => s.ratio ? { ...acc, [s.memberId]: s.ratio.toString() } : acc, {}) || {}
  );
  const [shares, setShares] = useState<Record<string, string>>(
    existingExpense?.splits.reduce((acc, s) => s.shares ? { ...acc, [s.memberId]: s.shares.toString() } : acc, {}) || {}
  );

  const toggleMember = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const selectAll = () => setSelectedMembers(group.members.map(m => m.id));
  const selectNone = () => setSelectedMembers([]);

  const calculateSplits = (): ExpenseSplit[] => {
    const totalAmount = parseFloat(amount);
    
    switch (splitType) {
      case 'equal': {
        const perPerson = totalAmount / selectedMembers.length;
        return selectedMembers.map(memberId => ({
          memberId,
          amount: perPerson
        }));
      }
      
      case 'ratio': {
        const totalRatio = selectedMembers.reduce((sum, id) => 
          sum + (parseFloat(ratios[id]) || 0), 0
        );
        return selectedMembers.map(memberId => ({
          memberId,
          amount: (parseFloat(ratios[memberId]) || 0) / totalRatio * totalAmount,
          ratio: parseFloat(ratios[memberId]) || 0
        }));
      }
      
      case 'manual': {
        return selectedMembers.map(memberId => ({
          memberId,
          amount: parseFloat(manualSplits[memberId]) || 0
        }));
      }
      
      case 'shares': {
        const totalShares = selectedMembers.reduce((sum, id) => 
          sum + (parseFloat(shares[id]) || 0), 0
        );
        return selectedMembers.map(memberId => ({
          memberId,
          amount: (parseFloat(shares[memberId]) || 0) / totalShares * totalAmount,
          shares: parseFloat(shares[memberId]) || 0
        }));
      }
      
      default:
        return [];
    }
  };

  const handleSubmit = () => {
    if (!name.trim() || !amount || selectedMembers.length === 0) return;
    
    // Validate multiple payments if selected
    if (paidBy === 'multiple') {
      const totalPaid = Object.values(multiplePayments).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
      if (Math.abs(totalPaid - parseFloat(amount)) > 0.01) {
        alert(`Total payments (${totalPaid}) must equal expense amount (${amount})`);
        return;
      }
    }
    
    const expense: Expense = {
      id: existingExpense?.id || Date.now().toString(),
      name: name.trim(),
      amount: parseFloat(amount),
      date: new Date(date),
      category,
      paidBy,
      paidByMultiple: paidBy === 'multiple' 
        ? Object.entries(multiplePayments)
            .filter(([_, amt]) => parseFloat(amt) > 0)
            .map(([payerId, amt]) => ({ payerId, amount: parseFloat(amt) }))
        : undefined,
      splitType,
      splits: calculateSplits()
    };
    
    onAdd(expense);
  };

  // const getMemberName = (id: string) => group.members.find(m => m.id === id)?.name || '';

  return (
    <div className="bg-white rounded-lg shadow p-8">
      <h2 className="text-2xl font-bold mb-8">
        {existingExpense ? '✏️ Edit Expense' : '➕ Add Expense'}
      </h2>
      
      <div className="space-y-8">
        {/* Basic Info Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expense Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Dinner at restaurant"
                className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount ({group.currency}) *
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option>General</option>
                <option>Food</option>
                <option>Transport</option>
                <option>Accommodation</option>
                <option>Entertainment</option>
                <option>Shopping</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paid By *
              </label>
              <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value as any)}
                className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="locker">🔒 Cash Locker</option>
                <option value="multiple">👥 Multiple Payers</option>
                {group.members.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Multiple Payers Section */}
        {paidBy === 'multiple' && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Multiple Payers Contribution</h3>
            <p className="text-sm text-blue-700 mb-4">
              Enter how much each payer contributes. Total must equal {getCurrencySymbol(group.currency)}{amount || '0'}
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-3 bg-white rounded-lg border">
                <span className="flex-1 font-medium">🔒 Cash Locker</span>
                <input
                  type="number"
                  value={multiplePayments['locker'] || ''}
                  onChange={(e) => setMultiplePayments({ ...multiplePayments, locker: e.target.value })}
                  placeholder="0"
                  className="w-40 px-3 py-2 border rounded-md"
                />
                <span className="text-sm text-gray-500">{group.currency}</span>
              </div>
              
              {group.members.map(member => (
                <div key={member.id} className="flex items-center gap-4 p-3 bg-white rounded-lg border">
                  <span className="flex-1 font-medium">{member.name}</span>
                  <input
                    type="number"
                    value={multiplePayments[member.id] || ''}
                    onChange={(e) => setMultiplePayments({ ...multiplePayments, [member.id]: e.target.value })}
                    placeholder="0"
                    className="w-40 px-3 py-2 border rounded-md"
                  />
                  <span className="text-sm text-gray-500">{group.currency}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-white rounded-lg border-2 border-blue-300">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Total Paid:</span>
                <span className={`text-lg font-bold ${
                  Math.abs(Object.values(multiplePayments).reduce((sum, val) => sum + (parseFloat(val) || 0), 0) - (parseFloat(amount) || 0)) < 0.01
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {getCurrencySymbol(group.currency)}{Object.values(multiplePayments).reduce((sum, val) => sum + (parseFloat(val) || 0), 0).toLocaleString()}
                </span>
              </div>
              {amount && Math.abs(Object.values(multiplePayments).reduce((sum, val) => sum + (parseFloat(val) || 0), 0) - parseFloat(amount)) > 0.01 && (
                <p className="text-sm text-red-600 mt-2">
                  ⚠️ Total must equal {getCurrencySymbol(group.currency)}{parseFloat(amount).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Split Type Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Split Type</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => setSplitType('equal')}
              className={`px-6 py-3 rounded-md border-2 font-medium transition-colors ${
                splitType === 'equal' 
                  ? 'bg-blue-100 border-blue-500 text-blue-700' 
                  : 'bg-white border-gray-300 hover:border-blue-300'
              }`}
            >
              Equal
            </button>
            <button
              onClick={() => setSplitType('ratio')}
              className={`px-6 py-3 rounded-md border-2 font-medium transition-colors ${
                splitType === 'ratio' 
                  ? 'bg-blue-100 border-blue-500 text-blue-700' 
                  : 'bg-white border-gray-300 hover:border-blue-300'
              }`}
            >
              Ratio
            </button>
            <button
              onClick={() => setSplitType('manual')}
              className={`px-6 py-3 rounded-md border-2 font-medium transition-colors ${
                splitType === 'manual' 
                  ? 'bg-blue-100 border-blue-500 text-blue-700' 
                  : 'bg-white border-gray-300 hover:border-blue-300'
              }`}
            >
              Manual
            </button>
            <button
              onClick={() => setSplitType('shares')}
              className={`px-6 py-3 rounded-md border-2 font-medium transition-colors ${
                splitType === 'shares' 
                  ? 'bg-blue-100 border-blue-500 text-blue-700' 
                  : 'bg-white border-gray-300 hover:border-blue-300'
              }`}
            >
              Shares
            </button>
          </div>
        </div>

        {/* Members Selection Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Select Members *
            </h3>
            <div className="space-x-3">
              <button onClick={selectAll} className="text-sm text-blue-600 hover:underline font-medium">
                Select All
              </button>
              <button onClick={selectNone} className="text-sm text-blue-600 hover:underline font-medium">
                Clear All
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            {group.members.map(member => (
              <div key={member.id} className="flex items-center gap-4 p-4 border-2 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={selectedMembers.includes(member.id)}
                  onChange={() => toggleMember(member.id)}
                  className="w-5 h-5"
                />
                <span className="flex-1 font-medium text-gray-900">{member.name}</span>
                
                {selectedMembers.includes(member.id) && splitType === 'ratio' && (
                  <input
                    type="number"
                    value={ratios[member.id] || ''}
                    onChange={(e) => setRatios({ ...ratios, [member.id]: e.target.value })}
                    placeholder="Ratio"
                    className="w-24 px-2 py-1 border rounded text-sm"
                  />
                )}
                
                {selectedMembers.includes(member.id) && splitType === 'manual' && (
                  <input
                    type="number"
                    value={manualSplits[member.id] || ''}
                    onChange={(e) => setManualSplits({ ...manualSplits, [member.id]: e.target.value })}
                    placeholder="Amount"
                    className="w-32 px-2 py-1 border rounded text-sm"
                  />
                )}
                
                {selectedMembers.includes(member.id) && splitType === 'shares' && (
                  <input
                    type="number"
                    value={shares[member.id] || ''}
                    onChange={(e) => setShares({ ...shares, [member.id]: e.target.value })}
                    placeholder="Shares"
                    className="w-24 px-2 py-1 border rounded text-sm"
                  />
                )}
                
                {selectedMembers.includes(member.id) && splitType === 'equal' && (
                  <span className="text-sm text-gray-600">
                    {amount ? (parseFloat(amount) / selectedMembers.length).toFixed(2) : '0'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t">
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || !amount || selectedMembers.length === 0}
            className="flex-1 py-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 font-semibold text-lg transition-colors"
          >
            {existingExpense ? '✓ Update Expense' : '✓ Add Expense'}
          </button>
          <button
            onClick={onCancel}
            className="px-8 py-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
