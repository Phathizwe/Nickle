export const BUDGET_PRESETS = {
  balanced: [
    { name: 'Car Budget', percentage: 30, color: '#2563eb', type: 'vehicle', editable: true, protected: true },
    { name: 'Housing Budget', percentage: 20, color: '#16a34a', type: 'housing', editable: true, protected: true },
    { name: 'School Fees', percentage: 15, color: '#9333ea', type: 'education', editable: true, protected: false },
    { name: 'Groceries', percentage: 15, color: '#ea580c', type: 'groceries', editable: true, protected: false },
    { name: 'Savings', percentage: 10, color: '#0891b2', type: 'savings', editable: true, protected: false },
    { name: 'Other', percentage: 10, color: '#4b5563', type: 'other', editable: true, protected: true },
  ],
  conservative: [
    { name: 'Car Budget', percentage: 20, color: '#2563eb', type: 'vehicle', editable: true, protected: true },
    { name: 'Housing Budget', percentage: 25, color: '#16a34a', type: 'housing', editable: true, protected: true },
    { name: 'Savings', percentage: 20, color: '#0891b2', type: 'savings', editable: true, protected: false },
    { name: 'Groceries', percentage: 15, color: '#ea580c', type: 'groceries', editable: true, protected: false },
    { name: 'School Fees', percentage: 10, color: '#9333ea', type: 'education', editable: true, protected: false },
    { name: 'Other', percentage: 10, color: '#4b5563', type: 'other', editable: true, protected: true },
  ],
  aggressive: [
    { name: 'Car Budget', percentage: 35, color: '#2563eb', type: 'vehicle', editable: true, protected: true },
    { name: 'Housing Budget', percentage: 30, color: '#16a34a', type: 'housing', editable: true, protected: true },
    { name: 'Groceries', percentage: 15, color: '#ea580c', type: 'groceries', editable: true, protected: false },
    { name: 'School Fees', percentage: 10, color: '#9333ea', type: 'education', editable: true, protected: false },
    { name: 'Savings', percentage: 5, color: '#0891b2', type: 'savings', editable: true, protected: false },
    { name: 'Other', percentage: 5, color: '#4b5563', type: 'other', editable: true, protected: true },
  ],
};

export const AVAILABLE_CATEGORIES = [
  { name: 'School Fees', color: '#9333ea', type: 'education', editable: true, protected: false },
  { name: 'Groceries', color: '#ea580c', type: 'groceries', editable: true, protected: false },
  { name: 'Savings', color: '#0891b2', type: 'savings', editable: true, protected: false },
  { name: 'Entertainment', color: '#f59e0b', type: 'entertainment', editable: true, protected: false },
  { name: 'Healthcare', color: '#ec4899', type: 'healthcare', editable: true, protected: false },
  { name: 'Travel', color: '#8b5cf6', type: 'travel', editable: true, protected: false },
];