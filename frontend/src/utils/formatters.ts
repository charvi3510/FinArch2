export const formatCurrency = (amount: number, currency: 'INR' | 'USD' = 'INR'): string => {
  if (currency === 'INR') {
    // Format in Indian lakhs / crores when large, or standard locale
    if (Math.abs(amount) >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (Math.abs(amount) >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  } else {
    if (Math.abs(amount) >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)} M`;
    }
    if (Math.abs(amount) >= 1000) {
      return `$${(amount / 1000).toFixed(1)} K`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  }
};

export const formatFullCurrency = (amount: number, currency: 'INR' | 'USD' = 'INR'): string => {
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  } else {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  }
};

export const formatPercentage = (val: number): string => {
  return `${val >= 0 ? '+' : ''}${val.toFixed(1)}%`;
};
