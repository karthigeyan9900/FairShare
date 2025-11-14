export type Currency = 'INR' | 'VND' | 'MYR' | 'USD';

export const currencyConfig = {
  INR: {
    symbol: '₹',
    name: 'Indian Rupee',
    code: 'INR',
  },
  VND: {
    symbol: '₫',
    name: 'Vietnamese Dong',
    code: 'VND',
  },
  MYR: {
    symbol: 'RM',
    name: 'Malaysian Ringgit',
    code: 'MYR',
  },
  USD: {
    symbol: '$',
    name: 'US Dollar',
    code: 'USD',
  },
};

export const formatCurrency = (amount: number, currency: Currency): string => {
  const config = currencyConfig[currency];
  
  // Check if amount has decimals
  const hasDecimals = amount % 1 !== 0;
  
  // Format with decimals only if needed
  const formattedAmount = hasDecimals 
    ? amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : amount.toLocaleString();
  
  // All currencies: symbol goes before
  return `${config.symbol}${formattedAmount}`;
};

export const getCurrencySymbol = (currency: Currency): string => {
  return currencyConfig[currency].symbol;
};

export const getCurrencyName = (currency: Currency): string => {
  return currencyConfig[currency].name;
};


// Exchange rates (base: INR)
// Last updated: November 2025
export const exchangeRates: Record<Currency, number> = {
  INR: 1,          // 1 INR = 1 INR (base)
  VND: 297,        // 1 INR = 297 VND
  USD: 0.011,      // 1 INR = 0.011 USD
  MYR: 0.047,      // 1 INR = 0.047 RM
};

/**
 * Convert amount from one currency to another
 */
export const convertCurrency = (
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency
): number => {
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to INR first (base currency), then to target currency
  const amountInINR = amount / exchangeRates[fromCurrency];
  const convertedAmount = amountInINR * exchangeRates[toCurrency];
  
  return Math.round(convertedAmount * 100) / 100; // Round to 2 decimal places
};

/**
 * Format amount with currency, optionally showing original currency
 */
export const formatCurrencyWithConversion = (
  amount: number,
  originalCurrency: Currency,
  displayCurrency: Currency,
  showOriginal: boolean = false
): string => {
  const convertedAmount = convertCurrency(amount, originalCurrency, displayCurrency);
  const formatted = formatCurrency(convertedAmount, displayCurrency);
  
  if (showOriginal && originalCurrency !== displayCurrency) {
    const originalFormatted = formatCurrency(amount, originalCurrency);
    return `${formatted} (${originalFormatted})`;
  }
  
  return formatted;
};

/**
 * Get all unique currencies from a list of groups
 */
export const getUniqueCurrencies = (currencies: Currency[]): Currency[] => {
  return Array.from(new Set(currencies));
};
