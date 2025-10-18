import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useAuth } from '../components/contexts/AuthContext';
import NickleLogo from '../assets/nickle-logo.png';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const BUDGET_PRESETS = {
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

const AVAILABLE_CATEGORIES = [
  { name: 'School Fees', color: '#9333ea', type: 'education', editable: true, protected: false },
  { name: 'Groceries', color: '#ea580c', type: 'groceries', editable: true, protected: false },
  { name: 'Savings', color: '#0891b2', type: 'savings', editable: true, protected: false },
  { name: 'Entertainment', color: '#f59e0b', type: 'entertainment', editable: true, protected: false },
  { name: 'Healthcare', color: '#ec4899', type: 'healthcare', editable: true, protected: false },
  { name: 'Travel', color: '#8b5cf6', type: 'travel', editable: true, protected: false },
];

const PremiumFeatureDialog = ({ isOpen, onClose, onSignIn }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Unlock Premium Features</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 p-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">Premium Features Include:</h3>
          <ul className="space-y-2 text-sm">
            <li>✓ Save unlimited budget plans</li>
            <li>✓ Access budget history</li>
            <li>✓ Export detailed PDF reports</li>
            <li>✓ Sync across devices</li>
            <li>✓ Priority support</li>
          </ul>
        </div>
        <div className="border-t pt-4">
          <p className="text-center font-bold mb-2">Start Your 7-Day Free Trial</p>
          <p className="text-center text-sm text-gray-600 mb-4">Then R9.99/month</p>
          <div className="space-y-2">
            <Button onClick={() => onSignIn('google')} className="w-full" variant="outline">
              Sign in with Google
            </Button>
            <Button onClick={() => onSignIn('microsoft')} className="w-full" variant="outline">
              Sign in with Microsoft
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

const SaveDialog = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');

  const handleSave = () => {
    onSave(name || new Date().toLocaleString());
    setName('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Budget Plan</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 p-4">
          <div>
            <Label htmlFor="planName">Budget Plan Name</Label>
            <Input
              id="planName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name for this budget plan"
            />
          </div>
          <Button onClick={handleSave} className="w-full">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const HomePage = ({ onSelectCalculator, initialNetSalary, initialBudgetPercentage }) => {
  const navigate = useNavigate();
  const { user, subscription } = useAuth();
  
  // Basic state
  const [netSalary, setNetSalary] = useState(initialNetSalary || '');
  const [categories, setCategories] = useState(BUDGET_PRESETS.balanced);
  const [selectedPreset, setSelectedPreset] = useState('balanced');
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [isExiting, setIsExiting] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);

  // Premium feature states
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [includeCarReport, setIncludeCarReport] = useState(true);
  const [includeHouseReport, setIncludeHouseReport] = useState(true);
  const [logoBase64, setLogoBase64] = useState('');
  const [savedBudgets, setSavedBudgets] = useState([]);

  useEffect(() => {
    const savedData = localStorage.getItem('budgetPlanner');
    if (savedData) {
      const { categories: savedCategories, salary: savedSalary, preset: savedPreset } = JSON.parse(savedData);
      if (savedCategories) setCategories(savedCategories);
      if (savedSalary) setNetSalary(savedSalary);
      if (savedPreset) setSelectedPreset(savedPreset);
    }
  }, []);

  useEffect(() => {
    if (initialNetSalary && initialBudgetPercentage) {
      setNetSalary(initialNetSalary);
      setCategories(prevCategories => 
        prevCategories.map(cat => 
          cat.type === 'vehicle' 
            ? { ...cat, percentage: initialBudgetPercentage }
            : cat
        )
      );
    }

    // Logo conversion for PDF
    const img = new Image();
    img.src = NickleLogo;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      setLogoBase64(dataURL);
    };
  }, [initialNetSalary, initialBudgetPercentage]);

  useEffect(() => {
    const dataToSave = {
      categories,
      salary: netSalary,
      preset: selectedPreset
    };
    localStorage.setItem('budgetPlanner', JSON.stringify(dataToSave));
  }, [categories, netSalary, selectedPreset]);

  const handleSignIn = async (provider) => {
    try {
      // Implement your sign-in logic here
      setShowPremiumDialog(false);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleSaveClick = () => {
    if (!user || !subscription) {
      setShowPremiumDialog(true);
    } else {
      setShowSaveDialog(true);
    }
  };

  const saveBudgetPlan = async (name) => {
    if (!user || !subscription) return;

    try {
      const budgetData = {
        name,
        categories,
        netSalary,
        selectedPreset,
        createdAt: new Date().toISOString(),
        userId: user.uid
      };

      // Implement your save logic here
      console.log('Saving budget plan:', budgetData);
      
      setShowSaveDialog(false);
    } catch (error) {
      console.error('Error saving budget plan:', error);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const calculateAmountFromPercentage = (percentage) => {
    if (!netSalary) return 0;
    return (parseFloat(netSalary) * (percentage / 100));
  };

  const handleCategoryClick = async (category) => {
    if (category.type === 'vehicle') {
      setIsExiting(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      const vehicleCategory = categories.find(cat => cat.type === 'vehicle');
      onSelectCalculator('vehicle', netSalary, vehicleCategory.percentage);
      navigate('/vehicle-cost-calculator');
    } else if (category.type === 'housing') {
      setIsExiting(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      const housingCategory = categories.find(cat => cat.type === 'housing');
      onSelectCalculator('housing', netSalary, housingCategory.percentage);
      navigate('/house-cost-calculator');
    }
  };

  const applyPreset = (presetName) => {
    setCategories(BUDGET_PRESETS[presetName]);
    setSelectedPreset(presetName);
  };

  const updateCategoryPercentage = (category, newPercentage) => {
    if (!netSalary) return;
    
    const boundedPercentage = Math.min(Math.max(newPercentage, 0), 100);
    
    setCategories(prevCategories =>
      prevCategories.map(cat =>
        cat.name === category.name
          ? { ...cat, percentage: boundedPercentage }
          : cat
      )
    );
  };

  const updateCategoryAmount = (category, newAmount) => {
    if (!netSalary) return;
    const newPercentage = (newAmount / parseFloat(netSalary)) * 100;
    updateCategoryPercentage(category, newPercentage);
  };

  const getTotalPercentage = () => {
    return categories.reduce((sum, cat) => sum + cat.percentage, 0);
  };

  const removeCategory = (categoryToRemove) => {
    if (categoryToRemove.protected) return;
    setCategories(prevCategories => 
      prevCategories.filter(cat => cat.name !== categoryToRemove.name)
    );
  };

  const addCategory = (newCategory) => {
    setCategories(prevCategories => [...prevCategories, { ...newCategory, percentage: 0 }]);
    setShowAddCategory(false);
  };

  const CategoryTooltip = ({ active, payload }) => {
    if (active && payload && payload.length && netSalary) {
      const data = payload[0].payload;
      const amount = calculateAmountFromPercentage(data.percentage);
      return (
        <div className="bg-white p-2 md:p-4 shadow-lg rounded-lg border text-xs md:text-sm">
          <p className="font-semibold">{data.name}</p>
          <p className="text-gray-600">{data.percentage.toFixed(1)}% of income</p>
          <p className="text-base md:text-lg font-bold">{formatCurrency(amount)}</p>
          {(data.type === 'vehicle' || data.type === 'housing') && (
            <p className="text-xs md:text-sm text-blue-600 mt-1">Click to calculate</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-12">
      <div className="max-w-4xl mx-auto px-4 space-y-4 md:space-y-8">
        {/* Save Button */}
        <div className="flex justify-end">
          {netSalary && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveClick}
              className="mb-4"
            >
              {user && subscription ? 'Save Budget Plan' :
              'Upgrade to Save'}
            </Button>
          )}
        </div>

        {/* Budget Input */}
        <Card className="mb-4 md:mb-8">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl font-bold text-center">Budget Planner</CardTitle>
            <CardDescription className="text-center">
              Enter your monthly income to start planning your budget
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-md mx-auto">
              <Label htmlFor="netSalary">Monthly Net Salary</Label>
              <Input
                id="netSalary"
                type="number"
                value={netSalary}
                onChange={(e) => setNetSalary(e.target.value)}
                placeholder="Enter your net monthly salary"
                className="text-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Preset Selection */}
        <Card className="mb-4 md:mb-8">
          <CardContent className="pt-4 md:pt-6">
            <div className="flex flex-col gap-4">
              <div className="text-center mb-2">
                <h3 className="font-medium text-sm md:text-base">Choose a Budget Preset</h3>
              </div>
              <div className="flex flex-wrap md:flex-nowrap justify-center gap-2 md:gap-4">
                {Object.entries(BUDGET_PRESETS).map(([name, _]) => (
                  <Button
                    key={name}
                    variant={selectedPreset === name ? "default" : "outline"}
                    onClick={() => applyPreset(name)}
                    className="capitalize text-xs md:text-sm px-2 md:px-4"
                  >
                    {name}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chart */}
        <Card>
          <CardContent className="pt-6">
            <div className="h-[300px] md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="percentage"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    innerRadius="60%"
                    paddingAngle={2}
                    onMouseEnter={(_, index) => setHoveredCategory(index)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    onClick={(_, index) => handleCategoryClick(categories[index])}
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      percent,
                      name,
                    }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = 25 + innerRadius + (outerRadius - innerRadius);
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);

                      return (
                        <text
                          x={x}
                          y={y}
                          className="fill-current text-xs md:text-sm"
                          textAnchor={x > cx ? 'start' : 'end'}
                          dominantBaseline="central"
                        >
                          {window.innerWidth < 768 
                            ? `${(percent * 100).toFixed(1)}%`
                            : `${name} (${(percent * 100).toFixed(1)}%)`}
                        </text>
                      );
                    }}
                  >
                    {categories.map((category, index) => (
                      <Cell
                        key={category.name}
                        fill={category.color}
                        opacity={hoveredCategory === index ? 1 : 0.8}
                        stroke={hoveredCategory === index ? '#fff' : 'none'}
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CategoryTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category List */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <CardTitle className="text-lg md:text-xl">Budget Breakdown</CardTitle>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500">
                  Total: {formatCurrency(netSalary)}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddCategory(!showAddCategory)}
                >
                  Add Category
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {showAddCategory && (
                <Card className="p-4 border border-dashed">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {AVAILABLE_CATEGORIES
                      .filter(cat => !categories.some(existing => existing.name === cat.name))
                      .map((category) => (
                        <Button
                          key={category.name}
                          variant="outline"
                          size="sm"
                          onClick={() => addCategory(category)}
                          className="text-xs md:text-sm justify-start"
                        >
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </Button>
                      ))}
                  </div>
                </Card>
              )}

              {categories.map((category) => {
                const amount = calculateAmountFromPercentage(category.percentage);
                return (
                  <div
                    key={category.name}
                    className="p-3 md:p-4 rounded-lg transition-colors bg-gray-50"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 md:w-4 md:h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium text-sm md:text-base">{category.name}</span>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 ml-5 md:ml-auto">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={Math.round(amount)}
                            onChange={(e) => updateCategoryAmount(category, parseFloat(e.target.value))}
                            className="w-24 md:w-32 text-right text-sm md:text-base"
                            disabled={!netSalary}
                          />
                          <span className="text-xs md:text-sm text-gray-500">
                            ({category.percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {category.type === 'vehicle' || category.type === 'housing' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs md:text-sm whitespace-nowrap"
                              onClick={() => handleCategoryClick(category)}
                            >
                              Calculate {category.name.replace(' Budget', '')}
                            </Button>
                          ) : !category.protected && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCategory(category)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Slider
                        value={[category.percentage]}
                        onValueChange={(value) => updateCategoryPercentage(category, value[0])}
                        min={0}
                        max={100}
                        step={0.1}
                        className="mt-2"
                      />
                    </div>
                  </div>
                );
              })}

              <div className="pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Allocation</span>
                  <span className={getTotalPercentage() > 100 ? 'text-red-500' : 'text-gray-900'}>
                    {getTotalPercentage().toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Premium Feature Dialog */}
        <PremiumFeatureDialog
          isOpen={showPremiumDialog}
          onClose={() => setShowPremiumDialog(false)}
          onSignIn={handleSignIn}
        />

        {/* Save Dialog */}
        <SaveDialog
          isOpen={showSaveDialog}
          onClose={() => setShowSaveDialog(false)}
          onSave={saveBudgetPlan}
        />
      </div>
    </div>
  );
};

export default HomePage;