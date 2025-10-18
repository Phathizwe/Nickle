export const DEFAULT_VALUES = {
  term: 60,
  interestRate: 13,
  balloonPayment: 0,
  budgetPercentage: 30
};

export const DEFAULT_EXPENSES = {
  insurance: '500',
  petrol: '500',
  additional: [
    {
      name: 'Knocks and Dents Micro-Insurance',
      amount: '0',
      type: 'insurance'
    },
    {
      name: 'Vehicle Maintenance Pledge',
      amount: '0',
      type: 'pledge'
    },
    {
      name: 'License Disc Renewal Pledge',
      amount: '70',
      type: 'pledge'
    },
    {
      name: 'Car Washes',
      amount: '0',
      type: 'other'
    }
  ]
};

export const EXPENSE_TYPES = [
  { value: 'insurance', label: 'Insurance', color: '#4F46E5', icon: 'shield-check' },
  { value: 'petrol', label: 'Petrol', color: '#10B981', icon: 'fuel' },
  { value: 'pledge', label: 'Pledge (Savings)', color: '#F59E0B', icon: 'piggy-bank' },
  { value: 'other', label: 'Other', color: '#6B7280', icon: 'more-horizontal' }
];

export const EXPENSE_COLORS = {
  insurance: '#4F46E5',
  petrol: '#10B981',
  pledge: '#F59E0B',
  other: '#6B7280'
};

export const getExpenseColor = (type) => {
  return EXPENSE_COLORS[type] || EXPENSE_COLORS.other;
};

export const getExpenseType = (value) => {
  return EXPENSE_TYPES.find(type => type.value === value) || EXPENSE_TYPES[3]; // Default to 'other'
};