// Remove this import line as it's causing the circular dependency
// import { formatCurrency } from './utils/formatters';

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0);
};