import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  TrendingUp, TrendingDown, DollarSign, Home as HomeIcon, 
  Car, ShoppingCart, Zap, Heart, Briefcase, PiggyBank,
  Plus, Edit2, Save, X, Check, Download
} from 'lucide-react';
import { exportCashflowToPDF } from '../../utils/pdfExport';
import { cn } from '../../lib/utils';

const CashflowBudget = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [netSalary, setNetSalary] = useState(() => {
    return parseFloat(localStorage.getItem('userSalary')) || 0;
  });

  // Get calculator results
  const [carBudget, setCarBudget] = useState(() => {
    const saved = localStorage.getItem('carCalculation');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [houseBudget, setHouseBudget] = useState(() => {
    const saved = localStorage.getItem('houseCalculation');
    return saved ? JSON.parse(saved) : null;
  });

  // Custom expense categories
  const [customExpenses, setCustomExpenses] = useState(() => {
    const saved = localStorage.getItem('customExpenses');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Groceries', amount: 0, icon: 'ShoppingCart' },
      { id: 2, name: 'Utilities', amount: 0, icon: 'Zap' },
      { id: 3, name: 'Entertainment', amount: 0, icon: 'Heart' },
    ];
  });

  // Savings categories
  const [savings, setSavings] = useState(() => {
    const saved = localStorage.getItem('savings');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Emergency Fund', amount: 0 },
      { id: 2, name: 'Retirement', amount: 0 },
      { id: 3, name: 'Investments', amount: 0 },
    ];
  });

  const [editingExpense, setEditingExpense] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  
  // Budget mode: 'after' (with car/house) or 'before' (saving for deposits)
  const [budgetMode, setBudgetMode] = useState(() => {
    return localStorage.getItem('budgetMode') || 'after';
  });
  
  // Current costs (for BEFORE mode calculations)
  const [currentHousingCost, setCurrentHousingCost] = useState(() => {
    return parseFloat(localStorage.getItem('currentHousingCost')) || 0;
  });
  
  const [currentTransportCost, setCurrentTransportCost] = useState(() => {
    return parseFloat(localStorage.getItem('currentTransportCost')) || 0;
  });

  useEffect(() => {
    localStorage.setItem('customExpenses', JSON.stringify(customExpenses));
  }, [customExpenses]);

  useEffect(() => {
    localStorage.setItem('savings', JSON.stringify(savings));
  }, [savings]);

  useEffect(() => {
    if (netSalary) {
      localStorage.setItem('userSalary', netSalary.toString());
    }
  }, [netSalary]);

  useEffect(() => {
    localStorage.setItem('budgetMode', budgetMode);
  }, [budgetMode]);

  useEffect(() => {
    localStorage.setItem('currentHousingCost', currentHousingCost.toString());
  }, [currentHousingCost]);

  useEffect(() => {
    localStorage.setItem('currentTransportCost', currentTransportCost.toString());
  }, [currentTransportCost]);

  const formatCurrency = (value) => {
    if (!value && value !== 0) return 'R 0';
    return 'R ' + Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  // Calculate totals
  const totalIncome = netSalary;
  
  // AFTER mode: Show monthly payments for car and house
  // BEFORE mode: Show savings goals for deposits
  const carExpenses = (budgetMode === 'after' && carBudget) ? carBudget.totalMonthlyCost : 0;
  const houseExpenses = (budgetMode === 'after' && houseBudget) ? houseBudget.totalMonthlyCost : 0;
  const currentCostsExpenses = (budgetMode === 'before') ? (currentHousingCost + currentTransportCost) : 0;
  const customExpensesTotal = customExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const totalExpenses = carExpenses + houseExpenses + currentCostsExpenses + customExpensesTotal;
  
  // Calculate savings for BEFORE mode
  // Net savings = Dream budget (30%) - Current costs
  const carSavingsGoalGross = (budgetMode === 'before' && carBudget) ? netSalary * 0.30 : 0;
  const houseSavingsGoalGross = (budgetMode === 'before' && houseBudget) ? netSalary * 0.30 : 0;
  const carSavingsGoal = Math.max(0, carSavingsGoalGross - currentTransportCost);
  const houseSavingsGoal = Math.max(0, houseSavingsGoalGross - currentHousingCost);
  const regularSavings = savings.reduce((sum, sav) => sum + (sav.amount || 0), 0);
  const totalSavings = regularSavings + carSavingsGoal + houseSavingsGoal;
  
  // Calculate deposit requirements
  const carDeposit = carBudget ? (carBudget.affordableCarPrice * 0.20) : 0; // 20% deposit
  const houseDeposit = houseBudget ? (houseBudget.affordableHomePrice * 0.10) : 0; // 10% deposit
  const carUpfrontCosts = carBudget ? carDeposit : 0;
  const houseUpfrontCosts = houseBudget ? (houseDeposit + (houseBudget.transferDuty || 0) + (houseBudget.bondCosts || 0)) : 0;
  
  const netCashflow = totalIncome - totalExpenses - totalSavings;

  const handleEditExpense = (expense) => {
    setEditingExpense(expense.id);
    setEditingValue(expense.amount.toString());
  };

  const handleSaveExpense = (expenseId) => {
    setCustomExpenses(customExpenses.map(exp => 
      exp.id === expenseId ? { ...exp, amount: parseFloat(editingValue) || 0 } : exp
    ));
    setEditingExpense(null);
    setEditingValue('');
  };

  const handleEditSaving = (saving) => {
    setEditingExpense(`saving-${saving.id}`);
    setEditingValue(saving.amount.toString());
  };

  const handleSaveSaving = (savingId) => {
    setSavings(savings.map(sav => 
      sav.id === savingId ? { ...sav, amount: parseFloat(editingValue) || 0 } : sav
    ));
    setEditingExpense(null);
    setEditingValue('');
  };

  const addCustomExpense = () => {
    const newId = Math.max(...customExpenses.map(e => e.id), 0) + 1;
    setCustomExpenses([...customExpenses, { id: newId, name: 'New Expense', amount: 0, icon: 'DollarSign' }]);
  };

  const addSaving = () => {
    const newId = Math.max(...savings.map(s => s.id), 0) + 1;
    setSavings([...savings, { id: newId, name: 'New Saving', amount: 0 }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {budgetMode === 'after' ? (
                  <>Your Budget <span className="text-green-600">After</span> Buying Your Dream Car & House</>
                ) : (
                  <>Your Budget <span className="text-purple-600">Before</span> - Saving for Your Dreams</>
                )}
              </h1>
              <p className="text-gray-600">
                {budgetMode === 'after' 
                  ? 'Life with your dream car and house - monthly payments included'
                  : 'Save for deposits and upfront costs to make your dreams a reality'
                }
              </p>
            </div>
            {user && (
              <Button
                onClick={() => exportCashflowToPDF(netSalary, carBudget, houseBudget, customExpenses, savings, budgetMode, currentHousingCost, currentTransportCost)}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export PDF
              </Button>
            )}
          </div>
        </div>

        {/* Mode Toggle Button */}
        {(carBudget || houseBudget) && (
          <Card className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {budgetMode === 'after' 
                      ? "Haven't bought your dream car or house yet?"
                      : "Want to see life after you've achieved your goals?"
                    }
                  </h3>
                  <p className="text-sm text-gray-600">
                    {budgetMode === 'after'
                      ? 'Switch to savings mode to see how to save for deposits and upfront costs'
                      : 'Switch to see your budget once you own your dream car and house'
                    }
                  </p>
                </div>
                <Button
                  onClick={() => setBudgetMode(budgetMode === 'after' ? 'before' : 'after')}
                  className={cn(
                    "ml-4",
                    budgetMode === 'after' 
                      ? "bg-purple-600 hover:bg-purple-700" 
                      : "bg-green-600 hover:bg-green-700"
                  )}
                  size="lg"
                >
                  {budgetMode === 'after' ? '💰 Show Me How to Save' : '🎯 Show Life After Purchase'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* INCOME Section */}
        <Card className="mb-6 border-2 border-green-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Income</h2>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(totalIncome)}
                </p>
                <p className="text-sm text-gray-500">per month</p>
              </div>
            </div>

            {netSalary === 0 && (
              <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  💡 <strong>Add your monthly take-home salary</strong> to see your complete cashflow. Click the edit icon to get started!
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 px-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">Employment (Net)</span>
                </div>
                {editingExpense === 'salary' ? (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-semibold">R</span>
                    <Input
                      type="number"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      className="w-32 h-8 text-right"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        setNetSalary(parseFloat(editingValue) || 0);
                        setEditingExpense(null);
                        setEditingValue('');
                      }}
                      className="h-8 bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingExpense(null);
                        setEditingValue('');
                      }}
                      className="h-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{formatCurrency(netSalary)}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingExpense('salary');
                        setEditingValue(netSalary.toString());
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* EXPENSES Section */}
        <Card className="mb-6 border-2 border-orange-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <TrendingDown className="h-6 w-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Expenses</h2>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-orange-600">
                  {formatCurrency(totalExpenses)}
                </p>
                <p className="text-sm text-gray-500">per month</p>
              </div>
            </div>

            <div className="space-y-2">
              {/* House - Detailed Breakdown */}
              {houseBudget && houseBudget.breakdown && (
                <div className="space-y-2">
                  {/* House Header */}
                  <div className="flex items-center justify-between py-2 px-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <HomeIcon className="h-5 w-5 text-green-600" />
                      <span className="font-bold text-gray-900">
                        {budgetMode === 'before' ? '🏠 Dream House Expenses' : 'House'}
                      </span>
                      {budgetMode === 'before' && (
                        <span className="text-sm text-gray-500">(collapsed)</span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/house')}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* House Line Items - Hidden in BEFORE mode */}
                  {budgetMode === 'after' && (
                  <div className="pl-8 space-y-1">
                    <div className="flex items-center justify-between py-2 px-3 bg-white rounded-lg">
                      <span className="text-gray-700 text-sm">Bond Repayment</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(houseBudget.breakdown.bondRepayment)}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 bg-white rounded-lg">
                      <span className="text-gray-700 text-sm">Rates & Taxes</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(houseBudget.breakdown.rates)}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 bg-white rounded-lg">
                      <span className="text-gray-700 text-sm">Home Insurance</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(houseBudget.breakdown.insurance)}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 bg-white rounded-lg">
                      <span className="text-gray-700 text-sm">Maintenance</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(houseBudget.breakdown.maintenance)}</span>
                    </div>
                  </div>
                  )}
                </div>
              )}

              {/* Car - Detailed Breakdown */}
              {carBudget && carBudget.breakdown && (
                <div className="space-y-2">
                  {/* Car Header */}
                  <div className="flex items-center justify-between py-2 px-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Car className="h-5 w-5 text-blue-600" />
                      <span className="font-bold text-gray-900">
                        {budgetMode === 'before' ? '🚗 Dream Car Expenses' : 'Car'}
                      </span>
                      {budgetMode === 'before' && (
                        <span className="text-sm text-gray-500">(collapsed)</span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/vehicle')}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Car Line Items - Hidden in BEFORE mode */}
                  {budgetMode === 'after' && (
                  <div className="pl-8 space-y-1">
                    <div className="flex items-center justify-between py-2 px-3 bg-white rounded-lg">
                      <span className="text-gray-700 text-sm">Monthly Repayment</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(carBudget.breakdown.repayment)}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 bg-white rounded-lg">
                      <span className="text-gray-700 text-sm">Insurance</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(carBudget.breakdown.insurance)}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 bg-white rounded-lg">
                      <span className="text-gray-700 text-sm">Petrol</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(carBudget.breakdown.petrol)}</span>
                    </div>
                  </div>
                  )}
                </div>
              )}

              {/* Current Costs - BEFORE mode only */}
              {budgetMode === 'before' && (
                <>
                  {/* Current Housing Cost */}
                  <div className="py-3 px-3 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HomeIcon className="h-5 w-5 text-yellow-600" />
                        <span className="font-semibold text-gray-900">Current Housing Costs</span>
                        <span className="text-xs text-gray-500">(rent, current bond, etc.)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={currentHousingCost}
                          onChange={(e) => setCurrentHousingCost(parseFloat(e.target.value) || 0)}
                          className="w-32 h-8"
                          placeholder="R 0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Current Transport Cost */}
                  <div className="py-3 px-3 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Car className="h-5 w-5 text-yellow-600" />
                        <span className="font-semibold text-gray-900">Current Transport Costs</span>
                        <span className="text-xs text-gray-500">(taxi, Uber, current car, etc.)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={currentTransportCost}
                          onChange={(e) => setCurrentTransportCost(parseFloat(e.target.value) || 0)}
                          className="w-32 h-8"
                          placeholder="R 0"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Custom Expenses */}
              {customExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between py-3 px-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <DollarSign className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700">{expense.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {editingExpense === expense.id ? (
                      <>
                        <Input
                          type="number"
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          className="w-32 h-8"
                          autoFocus
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSaveExpense(expense.id)}
                          className="text-green-600"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingExpense(null)}
                          className="text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="font-semibold text-gray-900 w-24 text-right">
                          {formatCurrency(expense.amount)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditExpense(expense)}
                          className="text-gray-600"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={addCustomExpense}
                className="w-full mt-2 border-dashed"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* SAVINGS Section */}
        <Card className="mb-6 border-2 border-purple-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <PiggyBank className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Savings</h2>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-purple-600">
                  {formatCurrency(totalSavings)}
                </p>
                <p className="text-sm text-gray-500">per month</p>
              </div>
            </div>

            <div className="space-y-2">
              {/* Car Savings Goal - BEFORE mode only */}
              {budgetMode === 'before' && carBudget && (
                <div className="py-3 px-4 bg-blue-100 border-2 border-blue-300 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Car className="h-5 w-5 text-blue-600" />
                      <span className="font-bold text-gray-900">Car Savings Goal</span>
                    </div>
                    <span className="text-xl font-bold text-blue-600">{formatCurrency(carSavingsGoal)}</span>
                  </div>
                  {/* Breakdown */}
                  <div className="text-sm bg-white p-3 rounded-lg mb-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">💰 Dream car budget (30%)</span>
                      <span className="font-semibold text-blue-600">{formatCurrency(carSavingsGoalGross)}</span>
                    </div>
                    {currentTransportCost > 0 && (
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-600">➖ Current transport costs</span>
                        <span className="font-semibold text-red-600">-{formatCurrency(currentTransportCost)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="font-bold text-gray-900">= Additional savings needed</span>
                      <span className="font-bold text-blue-600">{formatCurrency(carSavingsGoal)}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between mb-1">
                      <span>Target: {formatCurrency(carUpfrontCosts)} (20% deposit)</span>
                      <span className="font-semibold">
                        {carSavingsGoal > 0 ? Math.ceil(carUpfrontCosts / carSavingsGoal) : 0} months to save
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: '0%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* House Savings Goal - BEFORE mode only */}
              {budgetMode === 'before' && houseBudget && (
                <div className="py-3 px-4 bg-green-100 border-2 border-green-300 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <HomeIcon className="h-5 w-5 text-green-600" />
                      <span className="font-bold text-gray-900">House Savings Goal</span>
                    </div>
                    <span className="text-xl font-bold text-green-600">{formatCurrency(houseSavingsGoal)}</span>
                  </div>
                  {/* Breakdown */}
                  <div className="text-sm bg-white p-3 rounded-lg mb-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">💰 Dream house budget (30%)</span>
                      <span className="font-semibold text-green-600">{formatCurrency(houseSavingsGoalGross)}</span>
                    </div>
                    {currentHousingCost > 0 && (
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-600">➖ Current housing costs</span>
                        <span className="font-semibold text-red-600">-{formatCurrency(currentHousingCost)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="font-bold text-gray-900">= Additional savings needed</span>
                      <span className="font-bold text-green-600">{formatCurrency(houseSavingsGoal)}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between mb-1">
                      <span>Target: {formatCurrency(houseUpfrontCosts)} (deposit + costs)</span>
                      <span className="font-semibold">
                        {houseSavingsGoal > 0 ? Math.ceil(houseUpfrontCosts / houseSavingsGoal) : 0} months to save
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: '0%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Regular Savings */}
              {savings.map((saving) => (
                <div key={saving.id} className="flex items-center justify-between py-3 px-3 bg-purple-50 rounded-lg">
                  <span className="text-gray-700">{saving.name}</span>
                  <div className="flex items-center gap-2">
                    {editingExpense === `saving-${saving.id}` ? (
                      <>
                        <Input
                          type="number"
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          className="w-32 h-8"
                          autoFocus
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSaveSaving(saving.id)}
                          className="text-green-600"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingExpense(null)}
                          className="text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="font-semibold text-gray-900 w-24 text-right">
                          {formatCurrency(saving.amount)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditSaving(saving)}
                          className="text-gray-600"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={addSaving}
                className="w-full mt-2 border-dashed"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Saving
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* NET CASHFLOW */}
        <Card className={cn(
          "border-2 shadow-xl",
          netCashflow >= 0 ? "border-green-300 bg-gradient-to-br from-green-50 to-green-100" : "border-red-300 bg-gradient-to-br from-red-50 to-red-100"
        )}>
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Net Cashflow</p>
                <p className="text-lg text-gray-700">
                  {netCashflow >= 0 ? 'Money left over each month' : 'Overspending each month'}
                </p>
              </div>
              <div className="text-right">
                <p className={cn(
                  "text-4xl md:text-5xl font-bold",
                  netCashflow >= 0 ? "text-green-600" : "text-red-600"
                )}>
                  {formatCurrency(Math.abs(netCashflow))}
                </p>
                {netCashflow < 0 && (
                  <p className="text-sm text-red-600 mt-1">⚠️ Reduce expenses or increase income</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        {!user && (
          <Card className="mt-6 bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-200">
            <CardContent className="p-6 text-center">
              <h3 className="font-bold text-gray-900 mb-2 text-lg">
                💾 Save Your Cashflow Statement
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Sign up to save your budget, track changes over time, and access it from anywhere.
              </p>
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => navigate('/pricing')}
              >
                Sign Up - It's Free
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CashflowBudget;

