import { useMemo } from 'react';
import type { SplitwiseTransaction, Person } from '../types';

interface LockerConsumptionProps {
  transactions: SplitwiseTransaction[];
  people: Person[];
}

export default function LockerConsumption({ transactions, people }: LockerConsumptionProps) {
  const currency = transactions[0]?.currency || 'VND';

  const consumption = useMemo(() => {
    const personConsumption: Record<string, number> = {};
    
    // Initialize all people
    people.forEach(person => {
      personConsumption[person.name] = 0;
    });

    // Calculate consumption from locker transactions
    transactions
      .filter(t => t.paidFromLocker)
      .forEach(transaction => {
        // For each person in the transaction
        Object.entries(transaction.shares).forEach(([person, amount]) => {
          if (amount < 0) {
            // Negative amount = they owe this much (their consumption)
            personConsumption[person] = (personConsumption[person] || 0) + Math.abs(amount);
          } else if (amount > 0) {
            // Positive amount = they paid
            // Their consumption = Total cost - what others owe
            // OR: Total cost - their positive amount = their share
            const theirShare = transaction.cost - amount;
            personConsumption[person] = (personConsumption[person] || 0) + theirShare;
          }
        });
      });

    return Object.entries(personConsumption)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, people]);

  const totalConsumption = consumption.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Locker Consumption by Person</h3>
      <p className="text-sm text-gray-600 mb-4">
        How much each person has consumed from the cash locker. Locker managers (who handle payments) are not counted as consuming the full amount - only their actual share.
      </p>
      
      <div className="space-y-3">
        {consumption.map(person => {
          const percentage = totalConsumption > 0 
            ? (person.amount / totalConsumption * 100).toFixed(1)
            : 0;
          
          return (
            <div key={person.name} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">{person.name}</span>
              <div className="text-right">
                <span className="font-semibold">
                  {person.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                </span>
                <span className="text-sm text-gray-500 ml-2">({percentage}%)</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700">Total Consumption</span>
          <span className="text-xl font-bold text-blue-900">
            {totalConsumption.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
          </span>
        </div>
      </div>
    </div>
  );
}
