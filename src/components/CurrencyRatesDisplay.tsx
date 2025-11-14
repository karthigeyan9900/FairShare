import { useState } from 'react';
import { exchangeRates, currencyConfig, type Currency } from '../utils/currency';

export default function CurrencyRatesDisplay() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed top-20 right-4 z-40">
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
        {/* Header - Always Visible */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">💱</span>
            <span className="text-sm font-semibold text-gray-900">Exchange Rates</span>
          </div>
          <span className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {/* Expanded Rates */}
        {isExpanded && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gradient-to-br from-purple-50 to-indigo-50">
            <p className="text-xs text-gray-600 mb-3 font-medium">Base: 1 INR (₹)</p>
            <div className="space-y-2">
              {Object.entries(exchangeRates)
                .filter(([curr]) => curr !== 'INR')
                .map(([curr, rate]) => {
                  const config = currencyConfig[curr as Currency];
                  return (
                    <div
                      key={curr}
                      className="flex items-center justify-between text-sm bg-white rounded-lg px-3 py-2 shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{config.symbol}</span>
                        <span className="font-medium text-gray-900">{curr}</span>
                      </div>
                      <span className="font-semibold text-purple-600">
                        {rate.toLocaleString(undefined, { 
                          minimumFractionDigits: rate < 1 ? 3 : 0,
                          maximumFractionDigits: rate < 1 ? 3 : 0 
                        })}
                      </span>
                    </div>
                  );
                })}
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              Last updated: November 2025
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
