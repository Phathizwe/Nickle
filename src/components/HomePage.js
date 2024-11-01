import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Slider } from "./components/ui/slider";

// Define budget presets
const BUDGET_PRESETS = {
  balanced: [
    { name: 'Car Budget', percentage: 30, color: '#2563eb', type: 'vehicle', editable: true },
    { name: 'Housing', percentage: 20, color: '#16a34a', type: 'housing', editable: true },
    { name: 'School Fees', percentage: 15, color: '#9333ea', type: 'education', editable: true },
    { name: 'Groceries', percentage: 15, color: '#ea580c', type: 'groceries', editable: true },
    { name: 'Savings', percentage: 10, color: '#0891b2', type: 'savings', editable: true },
    { name: 'Other', percentage: 10, color: '#4b5563', type: 'other', editable: true },
  ],
  conservative: [
    { name: 'Car Budget', percentage: 20, color: '#2563eb', type: 'vehicle', editable: true },
    { name: 'Housing', percentage: 25, color: '#16a34a', type: 'housing', editable: true },
    { name: 'Savings', percentage: 20, color: '#0891b2', type: 'savings', editable: true },
    { name: 'Groceries', percentage: 15, color: '#ea580c', type: 'groceries', editable: true },
    { name: 'School Fees', percentage: 10, color: '#9333ea', type: 'education', editable: true },
    { name: 'Other', percentage: 10, color: '#4b5563', type: 'other', editable: true },
  ],
  aggressive: [
    { name: 'Car Budget', percentage: 35, color: '#2563eb', type: 'vehicle', editable: true },
    { name: 'Housing', percentage: 30, color: '#16a34a', type: 'housing', editable: true },
    { name: 'Groceries', percentage: 15, color: '#ea580c', type: 'groceries', editable: true },
    { name: 'School Fees', percentage: 10, color: '#9333ea', type: 'education', editable: true },
    { name: 'Savings', percentage: 5, color: '#0891b2', type: 'savings', editable: true },
    { name: 'Other', percentage: 5, color: '#4b5563', type: 'other', editable: true },
  ],
};

const HomePage = ({ onSelectCalculator }) => {
  const [netSalary, setNetSalary] = useState('');
  const [categories, setCategories] = useState(BUDGET_PRESETS.balanced);
  const [selectedPreset, setSelectedPreset] = useState('balanced');
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isExiting, setIsExiting] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('budgetPlanner');
    if (savedData) {
      const { categories: savedCategories, salary: savedSalary, preset: savedPreset } = JSON.parse(savedData);
      if (savedCategories) setCategories(savedCategories);
      if (savedSalary) setNetSalary(savedSalary);
      if (savedPreset) setSelectedPreset(savedPreset);
    }
  }, []);

  // Save data when it changes
  useEffect(() => {
    const dataToSave = {
      categories,
      salary: netSalary,
      preset: selectedPreset
    };
    localStorage.setItem('budgetPlanner', JSON.stringify(dataToSave));
  }, [categories, netSalary, selectedPreset]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const handleCategoryClick = async (category) => {
    if (editMode) {
      setSelectedCategory(category);
      return;
    }

    if (category.type === 'vehicle') {
      setIsExiting(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      onSelectCalculator('vehicle');
    }
  };

  const applyPreset = (presetName) => {
    setCategories(BUDGET_PRESETS[presetName]);
    setSelectedPreset(presetName);
    setSelectedCategory(null);
    setEditMode(false);
  };

  const updateCategoryPercentage = (percentage) => {
    if (!selectedCategory) return;

    const otherCategories = categories.filter(c => c !== selectedCategory);
    const currentTotal = otherCategories.reduce((sum, cat) => sum + cat.percentage, 0);
    
    if (currentTotal + percentage <= 100) {
      setCategories(categories.map(cat =>
        cat === selectedCategory ? { ...cat, percentage } : cat
      ));
    }
  };

  const getTotalPercentage = () => {
    return categories.reduce((sum, cat) => sum + cat.percentage, 0);
  };

  const CategoryTooltip = ({ active, payload }) => {
    if (active && payload && payload.length && netSalary) {
      const data = payload[0].payload;
      const amount = (parseFloat(netSalary) * data.percentage) / 100;
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border">
          <p className="font-semibold">{data.name}</p>
          <p className="text-gray-600">{data.percentage}% of income</p>
          <p className="text-lg font-bold">{formatCurrency(amount)}</p>
          {data.type === 'vehicle' && !editMode && (
            <p className="text-sm text-blue-600 mt-1">Click to calculate</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Budget Input */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Budget Planner</CardTitle>
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
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              <div className="text-center mb-2">
                <h3 className="font-medium">Choose a Budget Preset</h3>
              </div>
              <div className="flex justify-center gap-4">
                {Object.entries(BUDGET_PRESETS).map(([name, _]) => (
                  <Button
                    key={name}
                    variant={selectedPreset === name ? "default" : "outline"}
                    onClick={() => applyPreset(name)}
                    className="capitalize"
                  >
                    {name}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Visualization */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Chart */}
          <Card>
            <CardContent className="pt-6">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categories}
                      dataKey="percentage"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={150}
                      innerRadius={100}
                      paddingAngle={2}
                      onMouseEnter={(_, index) => setHoveredCategory(index)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      onClick={(_, index) => handleCategoryClick(categories[index])}
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
              <div className="flex justify-between items-center">
                <CardTitle>Budget Breakdown</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? 'Done' : 'Edit'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.map((category) => {
                  const amount = netSalary ? (parseFloat(netSalary) * category.percentage) / 100 : 0;
                  return (
                    <div
                      key={category.name}
                      className={`p-4 rounded-lg transition-colors ${
                        selectedCategory === category ? 'bg-gray-100' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => editMode && setSelectedCategory(category)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <span className="font-semibold">{formatCurrency(amount)}</span>
                      </div>
                      {editMode && selectedCategory === category && (
                        <div className="mt-2">
                          <Slider
                            value={[category.percentage]}
                            onValueChange={(value) => updateCategoryPercentage(value[0])}
                            min={5}
                            max={50}
                            step={1}
                          />
                          <div className="flex justify-between text-sm text-gray-500 mt-1">
                            <span>{category.percentage}%</span>
                            <span>{formatCurrency((parseFloat(netSalary) * category.percentage) / 100)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                <div className="pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Allocation</span>
                    <span className={getTotalPercentage() > 100 ? 'text-red-500' : 'text-gray-900'}>
                      {getTotalPercentage()}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        {netSalary && (
          <div className="mt-8 text-center">
            <p className="text-lg text-gray-600 mb-4">
              Total Monthly Budget: {formatCurrency(netSalary)}
            </p>
            <Button
              onClick={() => handleCategoryClick({ type: 'vehicle' })}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Calculate Vehicle Budget
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;