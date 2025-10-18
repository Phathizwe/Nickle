export const DEFAULT_EXPENSES = [
  { 
    name: 'Building Insurance', 
    amount: '0', 
    type: 'insurance',
    color: '#4F46E5'
  },
  { 
    name: 'Home Contents Insurance', 
    amount: '0', 
    type: 'insurance',
    color: '#4F46E5'
  },
  { 
    name: 'Monthly Rates', 
    amount: '0', 
    type: 'rates',
    color: '#10B981'
  },
  { 
    name: 'Electricity', 
    amount: '0', 
    type: 'utility',
    color: '#F59E0B'
  },
  { 
    name: 'Water', 
    amount: '0', 
    type: 'utility',
    color: '#F59E0B'
  },
  { 
    name: 'Maintenance', 
    amount: '0', 
    type: 'maintenance',
    color: '#EF4444'
  },
  { 
    name: 'Gardening', 
    amount: '0', 
    type: 'maintenance',
    color: '#EF4444'
  }
];

export const EXPENSE_TYPES = {
  insurance: {
    label: 'Insurance',
    color: '#4F46E5',
    icon: 'insurance'
  },
  rates: {
    label: 'Rates & Taxes',
    color: '#10B981',
    icon: 'rates'
  },
  utility: {
    label: 'Utilities',
    color: '#F59E0B',
    icon: 'utility'
  },
  maintenance: {
    label: 'Maintenance',
    color: '#EF4444',
    icon: 'maintenance'
  },
  default: {
    label: 'Other',
    color: '#6B7280',
    icon: 'default'
  }
};

export const AVAILABLE_EXPENSE_TYPES = [
  {
    id: 'insurance',
    name: 'Insurance',
    color: '#4F46E5',
    description: 'Insurance related expenses'
  },
  {
    id: 'rates',
    name: 'Rates & Taxes',
    color: '#10B981',
    description: 'Municipal rates and taxes'
  },
  {
    id: 'utility',
    name: 'Utilities',
    color: '#F59E0B',
    description: 'Electricity, water, and other utilities'
  },
  {
    id: 'maintenance',
    name: 'Maintenance',
    color: '#EF4444',
    description: 'Property maintenance and repairs'
  }
];

export const TRANSFER_DUTY_BRACKETS = [
  { min: 0, max: 1100000, base: 0, rate: 0 },
  { min: 1100001, max: 1512500, base: 0, rate: 0.03 },
  { min: 1512501, max: 2117500, base: 12375, rate: 0.06 },
  { min: 2117501, max: 2722500, base: 44625, rate: 0.08 },
  { min: 2722501, max: 12100000, base: 88625, rate: 0.11 },
  { min: 12100001, max: Infinity, base: 1026000, rate: 0.13 }
];