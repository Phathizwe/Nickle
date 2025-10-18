import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import NickleLogo from '../assets/nickle-logo.png';
import { auth, db } from '../lib/firebase';
import { getAuth, signInWithPopup, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { useAuth } from '../components/contexts/AuthContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const DEFAULT_EXPENSES = [
  { name: 'Building Insurance', amount: '1000', type: 'default' },
  { name: 'Home Contents Insurance', amount: '1000', type: 'default' },
  { name: 'Monthly Rates', amount: '3500', type: 'default' },
  { name: 'Electricity', amount: '1500', type: 'default' },
  { name: 'Water', amount: '500', type: 'default' },
  { name: 'Maintenance', amount: '500', type: 'default' },
  { name: 'Gardening', amount: '1600', type: 'default' }
];

const TRANSFER_DUTY_BRACKETS = [
  { min: 0, max: 1100000, base: 0, rate: 0 },
  { min: 1100001, max: 1512500, base: 0, rate: 0.03 },
  { min: 1512501, max: 2117500, base: 12375, rate: 0.06 },
  { min: 2117501, max: 2722500, base: 44625, rate: 0.08 },
  { min: 2722501, max: 12100000, base: 88625, rate: 0.11 },
  { min: 12100001, max: Infinity, base: 1026000, rate: 0.13 }
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
            <li>✓ Save unlimited calculations</li>
            <li>✓ Access calculation history</li>
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
          <DialogTitle>Save Calculation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 p-4">
          <div>
            <Label htmlFor="calcName">Calculation Name</Label>
            <Input
              id="calcName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name for this calculation"
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

const HouseCostCalculator = ({ onBack, initialNetSalary, initialBudgetPercentage }) => {
  const navigate = useNavigate();
  const { user, subscription } = useAuth();
  
  // Premium feature states
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [savedCalculations, setSavedCalculations] = useState([]);
  
  // Basic state
  const [netSalary, setNetSalary] = useState(initialNetSalary || '');
  const [budgetPercentage, setBudgetPercentage] = useState(initialBudgetPercentage || 30);
  const [expenses, setExpenses] = useState(DEFAULT_EXPENSES);
  const [newExpense, setNewExpense] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [affordableHousePrice, setAffordableHousePrice] = useState('0');
  
  // Purchase costs state
  const [downPayment, setDownPayment] = useState('0');
  const [downPaymentPercentage, setDownPaymentPercentage] = useState(10);
  const [bondInitiationFee, setBondInitiationFee] = useState(7000);
  const [bondRegistrationRate, setBondRegistrationRate] = useState(2);
  
  // Loan details state
  const [term, setTerm] = useState(240);
  const [interestRate, setInterestRate] = useState(10);
  const [estimatedMonthlyRepayment, setEstimatedMonthlyRepayment] = useState(0);
  const [estimatedMonthlyExpenses, setEstimatedMonthlyExpenses] = useState(0);
  const [logoBase64, setLogoBase64] = useState('');

  useEffect(() => {
    if (initialNetSalary) {
      setNetSalary(initialNetSalary);
    }
    if (initialBudgetPercentage) {
      setBudgetPercentage(initialBudgetPercentage);
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const calculateTransferDuty = (price) => {
    // Convert price to number and ensure it's positive
    const numericPrice = Math.max(0, Number(price));
    
    const bracket = TRANSFER_DUTY_BRACKETS.find(
      bracket => numericPrice > bracket.min && numericPrice <= bracket.max
    );
    if (!bracket) return 0;
    return bracket.base + (numericPrice - bracket.min) * bracket.rate;
  };

  const calculateMonthlyRepayment = (loanAmount, years, yearlyInterestRate) => {
    const monthlyRate = yearlyInterestRate / 12 / 100;
    const numberOfPayments = years * 12;
    const monthlyPayment = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    return monthlyPayment;
  };

  const calculateAffordableHousePrice = () => {
    if (!netSalary) return;

    const monthlyBudget = parseFloat(netSalary) * (budgetPercentage / 100);
    const totalMonthlyExpenses = expenses.reduce((sum, expense) => 
      sum + parseFloat(expense.amount || 0), 0);
    
    setEstimatedMonthlyExpenses(totalMonthlyExpenses);

    const availableForRepayment = monthlyBudget - totalMonthlyExpenses;
    
    // Using the loan payment formula in reverse to find the affordable price
    const monthlyRate = interestRate / 12 / 100;
    const numberOfPayments = term;
    const loanAmount = availableForRepayment * 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1) / 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments));

    // Account for down payment
    const totalPrice = loanAmount / (1 - (downPaymentPercentage / 100));
    
    setAffordableHousePrice(totalPrice.toFixed(0));
    const calculatedDownPayment = totalPrice * (downPaymentPercentage / 100);
    setDownPayment(calculatedDownPayment.toFixed(0));
    
    const monthlyRepayment = calculateMonthlyRepayment(
      totalPrice - calculatedDownPayment,
      term / 12,
      interestRate
    );
    setEstimatedMonthlyRepayment(monthlyRepayment);
  };

  const handleAddExpense = () => {
    if (newExpense && newExpenseAmount) {
      setExpenses([
        ...expenses,
        {
          name: newExpense,
          amount: newExpenseAmount,
          type: 'custom'
        }
      ]);
      setNewExpense('');
      setNewExpenseAmount('');
    }
  };

  const handleRemoveExpense = (index) => {
    const newExpenses = [...expenses];
    newExpenses.splice(index, 1);
    setExpenses(newExpenses);
  };

  const handleSaveClick = () => {
    if (!user || !subscription) {
      setShowPremiumDialog(true);
    } else {
      setShowSaveDialog(true);
    }
  };

  const handleGenerateReport = () => {
    if (!user || !subscription) {
      setShowPremiumDialog(true);
      return;
    }
    generateReport();
  };

  const generateReport = () => {
    const doc = new jsPDF();
    let yPosition = 15;
    
    // Add logo
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', 85, yPosition, 40, 40);
      yPosition += 45;
    }

    // Add title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    const titleText = "House Cost Calculator Report";
    const titleWidth = doc.getStringUnitWidth(titleText) * doc.getFontSize() / doc.internal.scaleFactor;
    const titleX = (doc.internal.pageSize.width - titleWidth) / 2;
    doc.text(titleText, titleX, yPosition);
    yPosition += 20;

    // Basic Information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("Basic Information", 20, yPosition);
    yPosition += 10;
    doc.setFont('helvetica', 'normal');
    
    const basicInfo = [
      ['Net Monthly Salary', formatCurrency(netSalary)],
      ['Housing Budget', `${budgetPercentage}% of income`],
      ['Affordable House Price', formatCurrency(affordableHousePrice)],
      ['Down Payment', formatCurrency(downPayment)],
      ['Loan Amount', formatCurrency(affordableHousePrice - parseFloat(downPayment))],
    ];

    doc.autoTable({
      startY: yPosition,
      head: [['Item', 'Value']],
      body: basicInfo,
      margin: { left: 20 },
    });

    yPosition = doc.lastAutoTable.finalY + 20;

    // Purchase Costs
    doc.setFont('helvetica', 'bold');
    doc.text("Purchase Costs", 20, yPosition);
    yPosition += 10;

    const purchaseCosts = [
      ['Transfer Duty', formatCurrency(calculateTransferDuty(parseFloat(affordableHousePrice)))],
      ['Bond Registration Cost', formatCurrency((affordableHousePrice - parseFloat(downPayment)) * (bondRegistrationRate / 100))],
      ['Bond Initiation Fee', formatCurrency(bondInitiationFee)],
    ];

    doc.autoTable({
      startY: yPosition,
      head: [['Cost Item', 'Amount']],
      body: purchaseCosts,
      margin: { left: 20 },
    });

    yPosition = doc.lastAutoTable.finalY + 20;

    // Monthly Costs
    doc.setFont('helvetica', 'bold');
    doc.text("Monthly Costs", 20, yPosition);
    yPosition += 10;

    const monthlyCosts = [
      ['Bond Repayment', formatCurrency(estimatedMonthlyRepayment)],
      ['Monthly Expenses', formatCurrency(estimatedMonthlyExpenses)],
      ['Total Monthly Cost', formatCurrency(estimatedMonthlyRepayment + estimatedMonthlyExpenses)],
      ['Percentage of Income', `${(((estimatedMonthlyRepayment + estimatedMonthlyExpenses) / parseFloat(netSalary)) * 100).toFixed(1)}%`],
    ];

    doc.autoTable({
      startY: yPosition,
      head: [['Item', 'Amount']],
      body: monthlyCosts,
      margin: { left: 20 },
    });

    // Footer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Generated by Nickle House Cost Calculator', 20, 280);
    doc.text(new Date().toLocaleString(), 20, 285);

    doc.save('House_Cost_Report.pdf');
  };

  const handleSignIn = async (provider) => {
    // Implement your sign-in logic here
    setShowPremiumDialog(false);
  };

  const saveCalculation = async (name) => {
    // Implement your save calculation logic here
    setShowSaveDialog(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onBack(netSalary, budgetPercentage)}
          className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          ← Back to Budget Planner
        </button>
        {affordableHousePrice > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveClick}
          >
            {user && subscription ? 'Save Calculation' : 'Upgrade to Save'}
          </Button>
        )}
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Enter your financial details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="netSalary">Monthly Net Salary</Label>
            <Input
              id="netSalary"
              type="number"
              value={netSalary}
              onChange={(e) => setNetSalary(e.target.value)}
              placeholder="Enter your net monthly salary"
            />
          </div>
          <div>
            <Label>Housing Budget: {budgetPercentage}% of income</Label>
            <Slider
              value={[budgetPercentage]}
              onValueChange={(value) => setBudgetPercentage(value[0])}
              min={0}
              max={100}
              step={1}
            />
          </div>
        </CardContent>
      </Card>

      {/* Monthly Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Expenses</CardTitle>
          <CardDescription>Estimate your monthly housing expenses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {expenses.map((expense, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={expense.name}
                disabled={expense.type === 'default'}
                className="flex-grow"
              />
              <Input
                type="number"
                value={expense.amount}
                onChange={(e) => {
                  const newExpenses = [...expenses];
                  newExpenses[index].amount = e.target.value;
                  setExpenses(newExpenses);
                }}
                className="w-32"
              />
              {expense.type !== 'default' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveExpense(index)}
                  className="text-red-500"
                >
                  ×
                </Button>
              )}
            </div>
          ))}
          
          <div className="flex items-end gap-2">
            <div className="flex-grow">
              <Label htmlFor="newExpense">New Expense</Label>
              <Input
                id="newExpense"
                value={newExpense}
                onChange={(e) => setNewExpense(e.target.value)}
                placeholder="Expense name"
              />
            </div>
            <div className="w-32">
              <Label htmlFor="newExpenseAmount">Amount</Label>
              <Input
                id="newExpenseAmount"
                type="number"
                value={newExpenseAmount}
                onChange={(e) => setNewExpenseAmount(e.target.value)}
                placeholder="Amount"
              />
            </div>
            <Button onClick={handleAddExpense}>Add</Button>
          </div>
        </CardContent>
      </Card>

      {/* Loan Details */}
      <Card>
        <CardHeader>
          <CardTitle>Loan Details</CardTitle>
          <CardDescription>Configure your home loan preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Down Payment: {downPaymentPercentage}%</Label>
            <Slider
              value={[downPaymentPercentage]}
              onValueChange={(value) => setDownPaymentPercentage(value[0])}
              min={0}
              max={100}
              step={1}
            />
          </div>
          <div>
            <Label htmlFor="term">Loan Term (months)</Label>
            <Input
              id="term"
              type="number"
              value={term}
              onChange={(e) => setTerm(parseInt(e.target.value))}
              min={12}
              max={360}
            />
          </div>
          <div>
            <Label htmlFor="interestRate">Interest Rate (%)</Label>
            <Input
              id="interestRate"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value))}
              step={0.1}
            />
          </div>
        </CardContent>
      </Card>

      {/* Calculate Button */}
      <Button 
        onClick={calculateAffordableHousePrice} 
        className="w-full"
        size="lg"
      >
        Calculate Affordable House Price
      </Button>

      {/* Results */}
      {affordableHousePrice > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>Based on your inputs and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Affordable House Price:</span>
                  <span className="text-xl font-bold">{formatCurrency(affordableHousePrice)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Down Payment:</span>
                  <span>{formatCurrency(downPayment)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Loan Amount:</span>
                  <span>{formatCurrency(affordableHousePrice - parseFloat(downPayment))}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Transfer Duty:</span>
                  <span>{formatCurrency(calculateTransferDuty(parseFloat(affordableHousePrice)))}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Bond Registration Cost:</span>
                  <span>{formatCurrency((affordableHousePrice - parseFloat(downPayment)) * (bondRegistrationRate / 100))}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Bond Initiation Fee:</span>
                  <span>{formatCurrency(bondInitiationFee)}</span>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Monthly Bond Repayment:</span>
                  <span className="text-lg font-semibold">{formatCurrency(estimatedMonthlyRepayment)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Monthly Expenses:</span>
                  <span className="text-lg font-semibold">{formatCurrency(estimatedMonthlyExpenses)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Monthly Cost:</span>
                  <span className="text-xl font-bold">{formatCurrency(estimatedMonthlyRepayment + estimatedMonthlyExpenses)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Percentage of Income:</span>
                  <span className="font-semibold">
                    {(((estimatedMonthlyRepayment + estimatedMonthlyExpenses) / parseFloat(netSalary)) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Additional Costs to Consider:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Legal fees for transfer and bond registration</li>
                  <li>• Property inspection fees</li>
                  <li>• Moving costs</li>
                  <li>• Initial repairs or renovations</li>
                  <li>• Furniture and appliances</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Generate Report Button */}
          <Button 
            onClick={handleGenerateReport} 
            variant="outline" 
            className="w-full"
          >
            {user && subscription ? 'Generate Detailed Report' : 'Upgrade to Generate Report'}
          </Button>
        </>
      )}

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
        onSave={saveCalculation}
      />

      {/* Saved Calculations */}
      {user && subscription && savedCalculations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Saved Calculations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {savedCalculations.map((calc) => (
                <div
                  key={calc.id}
                  className="flex justify-between items-center p-2 bg-gray-50 hover:bg-gray-100 rounded cursor-pointer"
                  onClick={() => {
                    // Implement loading saved calculation
                  }}
                >
                  <div>
                    <p className="font-medium">{calc.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(calc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p>{formatCurrency(calc.data.affordableHousePrice)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HouseCostCalculator;