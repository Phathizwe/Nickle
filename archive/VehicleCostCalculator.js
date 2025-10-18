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

const PremiumFeatureDialog = ({ isOpen, onClose, onSignIn, onSubscribe }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-[425px]">
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
      <DialogContent className="sm:max-w-[425px]">
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

const VehicleCostCalculator = ({ onBack, initialNetSalary, initialBudgetPercentage }) => {
  const navigate = useNavigate();
  const { user, subscription } = useAuth();
  
  // Premium feature states
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [savedCalculations, setSavedCalculations] = useState([]);

  // Basic state
  const [netSalary, setNetSalary] = useState(initialNetSalary || '');
  const [budgetPercentage, setBudgetPercentage] = useState(initialBudgetPercentage || 30);
  
  // Monthly Vehicle Expenses
  const [insurance, setInsurance] = useState('');
  const [petrol, setPetrol] = useState('');
  const [additionalExpenses, setAdditionalExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  
  // Vehicle Purchasing Decisions
  const [affordableCarPrice, setAffordableCarPrice] = useState('0.00');
  const [deposit, setDeposit] = useState('0');
  const [term, setTerm] = useState(60);
  const [interestRate, setInterestRate] = useState(13);
  const [balloonPayment, setBalloonPayment] = useState(0);
  const [estimatedMonthlyRepayment, setEstimatedMonthlyRepayment] = useState(0);
  const [estimatedMonthlyExpenses, setEstimatedMonthlyExpenses] = useState(0);
  const [logoBase64, setLogoBase64] = useState('');

  // Load saved calculations for premium users
  useEffect(() => {
    if (user && subscription) {
      loadSavedCalculations();
    }
  }, [user, subscription]);

  const loadSavedCalculations = async () => {
    try {
      const calculationsRef = collection(db, 'calculations');
      const q = query(
        calculationsRef,
        where('userId', '==', user.uid),
        where('type', '==', 'vehicle'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const calculations = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSavedCalculations(calculations);
    } catch (error) {
      console.error('Error loading calculations:', error);
    }
  };

  const saveCalculation = async (name) => {
    if (!user || !subscription) {
      setShowPremiumDialog(true);
      return;
    }

    try {
      const calculationData = {
        userId: user.uid,
        type: 'vehicle',
        name,
        createdAt: new Date().toISOString(),
        data: {
          netSalary,
          budgetPercentage,
          insurance,
          petrol,
          additionalExpenses,
          affordableCarPrice,
          deposit,
          term,
          interestRate,
          balloonPayment,
          estimatedMonthlyRepayment,
          estimatedMonthlyExpenses
        }
      };

      await addDoc(collection(db, 'calculations'), calculationData);
      await loadSavedCalculations();
    } catch (error) {
      console.error('Error saving calculation:', error);
    }
  };

  const handleSignIn = async (provider) => {
    try {
      const auth = getAuth();
      const authProvider = provider === 'google' 
        ? new GoogleAuthProvider()
        : new OAuthProvider('microsoft.com');
      
      await signInWithPopup(auth, authProvider);
      setShowPremiumDialog(false);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  useEffect(() => {
    if (initialNetSalary) {
      setNetSalary(initialNetSalary);
    }
    if (initialBudgetPercentage) {
      setBudgetPercentage(initialBudgetPercentage);
    }

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
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value || 0).replace('ZAR', 'R');
  };

  const calculateMonthlyRepaymentForPrice = (price) => {
    if (!price || !interestRate) return 0;
    const principal = price - parseFloat(deposit || 0);
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const numberOfPayments = parseFloat(term);
    const balloon = (parseFloat(balloonPayment) / 100) * price;

    if (monthlyRate === 0) {
      return (principal - balloon) / numberOfPayments;
    }

    const monthlyPayment = (principal - (balloon / Math.pow(1 + monthlyRate, numberOfPayments))) *
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    return monthlyPayment;
  };

  const calculateAffordablePrice = () => {
    const totalMonthlyExpenses = parseFloat(insurance || 0) + 
      parseFloat(petrol || 0) + 
      additionalExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);

    const targetTotalMonthly = (parseFloat(netSalary) * (budgetPercentage / 100));
    const availableForRepayment = targetTotalMonthly - totalMonthlyExpenses;

    let low = 0;
    let high = 10000000;
    let bestPrice = 0;
    let iterations = 0;
    const maxIterations = 50;
    const tolerance = 1;

    while (low <= high && iterations < maxIterations) {
      const mid = (low + high) / 2;
      const monthlyRepayment = calculateMonthlyRepaymentForPrice(mid);

      if (Math.abs(monthlyRepayment - availableForRepayment) < tolerance) {
        bestPrice = mid;
        break;
      }

      if (monthlyRepayment < availableForRepayment) {
        low = mid + tolerance;
        bestPrice = mid;
      } else {
        high = mid - tolerance;
      }

      iterations++;
    }

    setAffordableCarPrice(Math.max(bestPrice, 0).toFixed(2));
    const finalMonthlyRepayment = calculateMonthlyRepaymentForPrice(bestPrice);
    setEstimatedMonthlyRepayment(finalMonthlyRepayment);
    setEstimatedMonthlyExpenses(totalMonthlyExpenses);
  };

  const addExpense = () => {
    if (newExpense && newExpenseAmount) {
      setAdditionalExpenses([...additionalExpenses, { 
        name: newExpense, 
        amount: newExpenseAmount 
      }]);
      setNewExpense('');
      setNewExpenseAmount('');
    }
  };

  const removeExpense = (index) => {
    setAdditionalExpenses(additionalExpenses.filter((_, i) => i !== index));
  };

  const calculateCurrentPercentage = () => {
    if (!netSalary) return 0;
    const totalMonthlyCosts = estimatedMonthlyRepayment + estimatedMonthlyExpenses;
    return ((totalMonthlyCosts / parseFloat(netSalary)) * 100).toFixed(1);
  };

  const handleBack = () => {
    const totalMonthlyVehicleCosts = estimatedMonthlyRepayment + estimatedMonthlyExpenses;
    const totalBudgetPercentage = (totalMonthlyVehicleCosts / parseFloat(netSalary)) * 100;
    onBack(netSalary, totalBudgetPercentage);
    navigate('/');
  };

  const handleGenerateReport = () => {
    if (!user || !subscription) {
      setShowPremiumDialog(true);
      return;
    }
    generateReport();
  };

  const handleSaveClick = () => {
    if (!user || !subscription) {
      setShowPremiumDialog(true);
    } else {
      setShowSaveDialog(true);
    }
  };

  const loadCalculation = (calculationData) => {
    const data = calculationData.data;
    setNetSalary(data.netSalary);
    setBudgetPercentage(data.budgetPercentage);
    setInsurance(data.insurance);
    setPetrol(data.petrol);
    setAdditionalExpenses(data.additionalExpenses);
    setDeposit(data.deposit);
    setTerm(data.term);
    setInterestRate(data.interestRate);
    setBalloonPayment(data.balloonPayment);
    setAffordableCarPrice(data.affordableCarPrice);
    setEstimatedMonthlyRepayment(data.estimatedMonthlyRepayment);
    setEstimatedMonthlyExpenses(data.estimatedMonthlyExpenses);
  };

  const generateReport = () => {
    const doc = new jsPDF();
    let yPosition = 15;
    
    // Add logo
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', 85, yPosition, 40, 40);
      yPosition += 45;
    }

    // Add title and slogan
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    const titleText = "Nickle Vehicle Cost Calculator";
    const titleWidth = doc.getStringUnitWidth(titleText) * doc.getFontSize() / doc.internal.scaleFactor;
    const titleX = (doc.internal.pageSize.width - titleWidth) / 2;
    doc.text(titleText, titleX, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const sloganText = "Smart Budgets Meet Big Ambitions";
    const sloganWidth = doc.getStringUnitWidth(sloganText) * doc.getFontSize() / doc.internal.scaleFactor;
    const sloganX = (doc.internal.pageSize.width - sloganWidth) / 2;
    doc.text(sloganText, sloganX, yPosition);
    yPosition += 10;

    // Add line break
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 10;

    // Basic Information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPosition);
    doc.text(`Net Monthly Salary: ${formatCurrency(netSalary)}`, 120, yPosition);
    yPosition += 15;

    // 1. Budget Overview
    doc.setFont('helvetica', 'bold');
    doc.text("1. Budget Overview", 20, yPosition);
    doc.setFont('helvetica', 'normal');
    yPosition += 10;
    doc.text(`Target Vehicle Budget: ${budgetPercentage}% of net salary`, 30, yPosition);
    yPosition += 7;
    doc.text(`Maximum Monthly Available: ${formatCurrency(parseFloat(netSalary) * (budgetPercentage / 100))}`, 30, yPosition);
    yPosition += 7;
    doc.text(`Current Budget Usage: ${calculateCurrentPercentage()}%`, 30, yPosition);
    yPosition += 15;

    // 2. Vehicle Cost Summary
    doc.setFont('helvetica', 'bold');
    doc.text("2. Vehicle Cost Summary", 20, yPosition);
    doc.setFont('helvetica', 'normal');
    yPosition += 10;
    doc.text(`Maximum Affordable Vehicle Price: ${formatCurrency(affordableCarPrice)}`, 30, yPosition);
    yPosition += 7;
    doc.text(`Monthly Repayment: ${formatCurrency(estimatedMonthlyRepayment)}`, 30, yPosition);
    yPosition += 7;
    doc.text(`Total Monthly Expenses: ${formatCurrency(estimatedMonthlyExpenses)}`, 30, yPosition);
    yPosition += 7;
    doc.text(`Total Monthly Cost: ${formatCurrency(estimatedMonthlyRepayment + estimatedMonthlyExpenses)}`, 30, yPosition);
    yPosition += 15;

    // 3. Vehicle Purchasing Details
    doc.setFont('helvetica', 'bold');
    doc.text("3. Vehicle Purchasing Details", 20, yPosition);
    doc.setFont('helvetica', 'normal');
    yPosition += 10;

    // Create a table for financing details
    const financingData = [
      ['Component', 'Value'],
      ['Vehicle Price', formatCurrency(affordableCarPrice)],
      ['Deposit', formatCurrency(deposit)],
      ['Finance Amount', formatCurrency(affordableCarPrice - parseFloat(deposit))],
      ['Term', `${term} months (${Math.floor(term/12)} years)`],
      ['Interest Rate', `${interestRate}%`],
      ['Balloon Payment', `${balloonPayment}% (${formatCurrency((balloonPayment/100) * affordableCarPrice)})`]
    ];

    doc.autoTable({
      startY: yPosition,
      head: [['Financing Component', 'Value']],
      body: financingData.slice(1),
      margin: { left: 30 },
      tableWidth: 150,
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 10 }
    });

    yPosition = doc.lastAutoTable.finalY + 15;

    // 4. Monthly Expenses Breakdown
    doc.setFont('helvetica', 'bold');
    doc.text("4. Monthly Expenses Breakdown", 20, yPosition);
    doc.setFont('helvetica', 'normal');
    yPosition += 10;

    // Create a table for monthly expenses
    const expensesData = [
      ['Expense Type', 'Amount'],
      ['Vehicle Repayment', formatCurrency(estimatedMonthlyRepayment)],
      ['Insurance', formatCurrency(insurance)],
      ['Fuel (Petrol)', formatCurrency(petrol)]
    ];

    // Add additional expenses
    additionalExpenses.forEach(expense => {
      expensesData.push([expense.name, formatCurrency(expense.amount)]);
    });

    // Add total
    expensesData.push(['Total Monthly Cost', formatCurrency(estimatedMonthlyRepayment + estimatedMonthlyExpenses)]);

    doc.autoTable({
      startY: yPosition,
      head: [['Expense Type', 'Monthly Amount']],
      body: expensesData.slice(1),
      margin: { left: 30 },
      tableWidth: 150,
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 10 },
      foot: [['Total Monthly Vehicle Costs', formatCurrency(estimatedMonthlyRepayment + estimatedMonthlyExpenses)]],
      footStyles: { fillColor: [241, 245, 249], textColor: [0, 0, 0], fontStyle: 'bold' }
    });

    // Add recommendations section if near budget limits
    const totalCost = estimatedMonthlyRepayment + estimatedMonthlyExpenses;
    const budgetLimit = parseFloat(netSalary) * (budgetPercentage / 100);
    
    if (totalCost > budgetLimit * 0.9) {
      doc.addPage();
      yPosition = 20;
      
      doc.setFont('helvetica', 'bold');
      doc.text("5. Budget Analysis and Recommendations", 20, yPosition);
      yPosition += 10;
      
      doc.setFont('helvetica', 'normal');
      doc.text("Budget Utilization:", 30, yPosition);
      yPosition += 7;
      
      const utilizationPercentage = (totalCost / budgetLimit) * 100;
      doc.text(`You are utilizing ${utilizationPercentage.toFixed(1)}% of your vehicle budget.`, 30, yPosition);
      yPosition += 15;
      
      doc.text("Recommendations:", 30, yPosition);
      yPosition += 7;
      
      const recommendations = [
        "Consider increasing your down payment to reduce monthly repayments",
        "Look for vehicles with better fuel efficiency to reduce petrol costs",
        "Compare insurance quotes from different providers",
        "Consider a shorter loan term to reduce total interest paid"
      ];
      
      recommendations.forEach(rec => {
        doc.text(`• ${rec}`, 35, yPosition);
        yPosition += 7;
      });
    }

    // Footer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Generated by Nickle Vehicle Cost Calculator', 20, 290);
    doc.text(new Date().toLocaleString(), 150, 290);

    doc.save("Nickle_Vehicle_Cost_Report.pdf");
  };

  return (
    <div className="w-full max-w-[600px] mx-auto p-4 space-y-6">
      <div className="text-center mb-6">
        <img src={NickleLogo} alt="Nickle Logo" className="w-16 h-16 mx-auto mb-2" />
        <h1 className="text-2xl font-bold">Vehicle Cost Calculator</h1>
        <p className="text-gray-600">Smart Budgets Meet Big Ambitions</p>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          ← Back to Budget Planner
        </button>
        {/* Add Save Button if calculation has been performed */}
        {affordableCarPrice > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveClick}
          >
            {user && subscription ? 'Save Calculation' : 'Upgrade to Save'}
          </Button>
        )}
      </div>

      <p className="text-gray-600">
        Calculate your maximum car budget while keeping total monthly costs at {budgetPercentage}% of your salary
      </p>

      {/* Load Saved Calculation for Premium Users */}
      {user && subscription && savedCalculations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Saved Calculations</CardTitle>
            <CardDescription>Click to load a previous calculation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {savedCalculations.map((calc) => (
                <div
                  key={calc.id}
                  className="flex justify-between items-center p-2 bg-gray-50 hover:bg-gray-100 rounded cursor-pointer"
                  onClick={() => loadCalculation(calc)}
                >
                  <div>
                    <p className="font-medium">{calc.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(calc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p>{formatCurrency(calc.data.affordableCarPrice)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        <div>
          <Label htmlFor="netSalary">Monthly Net Salary</Label>
          <Input
            id="netSalary"
            type="number"
            value={netSalary}
            onChange={(e) => setNetSalary(e.target.value)}
            placeholder="Enter your net salary"
          />
        </div>

        <div>
          <Label>Target Budget Percentage</Label>
          <div className="flex items-center justify-between gap-4 mt-2">
            <div className="flex items-center gap-2 flex-1">
              <Input
                type="number"
                value={Math.round((parseFloat(netSalary) * budgetPercentage) / 100) || 0}
                onChange={(e) => {
                  const newAmount = parseFloat(e.target.value) || 0;
                  const newPercentage = (newAmount / parseFloat(netSalary)) * 100;
                  setBudgetPercentage(Math.min(Math.max(newPercentage, 0), 50));
                }}
                className="w-32 text-right"
                disabled={!netSalary}
              />
              <span className="text-sm text-gray-500">
                ({budgetPercentage.toFixed(1)}%)
              </span>
            </div>
          </div>
          <Slider
            value={[budgetPercentage]}
            onValueChange={(value) => setBudgetPercentage(value[0])}
            min={0}
            max={50}
            step={0.1}
            className="mt-2"
          />
          <p className="text-sm text-gray-500 mt-1">
            Current: {calculateCurrentPercentage()}% of net salary
          </p>
        </div>

        {/* Monthly Vehicle Expenses Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Vehicle Expenses</CardTitle>
            <CardDescription>
              Enter your expected monthly vehicle running costs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="insurance">Monthly Insurance</Label>
              <Input
                id="insurance"
                type="number"
                value={insurance}
                onChange={(e) => setInsurance(e.target.value)}
                placeholder="Enter insurance cost"
              />
            </div>

            <div>
              <Label htmlFor="petrol">Monthly Petrol</Label>
              <Input
                id="petrol"
                type="number"
                value={petrol}
                onChange={(e) => setPetrol(e.target.value)}
                placeholder="Enter petrol cost"
              />
            </div>

            <div>
              <Label>Additional Monthly Expenses</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Expense name"
                  value={newExpense}
                  onChange={(e) => setNewExpense(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Amount"
                  value={newExpenseAmount}
                  onChange={(e) => setNewExpenseAmount(e.target.value)}
                />
                <Button onClick={addExpense}>+</Button>
              </div>
              {additionalExpenses.map((expense, index) => (
                <div key={index} className="flex justify-between items-center mt-2 p-2 bg-gray-50 rounded">
                  <span>{expense.name}</span>
                  <div className="flex items-center gap-2">
                    <span>{formatCurrency(expense.amount)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExpense(index)}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Purchasing Decisions Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vehicle Purchasing Decisions</CardTitle>
            <CardDescription>
              Configure your vehicle financing options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Deposit ({formatCurrency(deposit)})</Label>
              <Slider
                value={[parseFloat(deposit) || 0]}
                onValueChange={(value) => setDeposit(value[0].toString())}
                min={0}
                max={parseFloat(affordableCarPrice) || 100000}
                step={1000}
              />
            </div>

            <div>
              <Label>Interest Rate ({interestRate}%)</Label>
              <Slider
                value={[interestRate]}
                onValueChange={(value) => setInterestRate(value[0])}
                min={0}
                max={20}
                step={0.1}
              />
            </div>

            <div>
              <Label>Term ({term} months)</Label>
              <Slider
                value={[term]}
                onValueChange={(value) => setTerm(value[0])}
                min={12}
                max={72}
                step={12}
              />
            </div>

            <div>
              <Label>Balloon Payment ({balloonPayment}%)</Label>
              <Slider
                value={[balloonPayment]}
                onValueChange={(value) => setBalloonPayment(value[0])}
                min={0}
                max={50}
                step={1}
              />
            </div>
          </CardContent>
        </Card>

        <Button onClick={calculateAffordablePrice} className="w-full">
          Calculate Maximum Car Budget
        </Button>

        <Card className="bg-gray-50">
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Maximum Car Budget</p>
                <p className="text-2xl font-bold">{formatCurrency(affordableCarPrice)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estimated Monthly Repayment</p>
                <p className="text-xl">{formatCurrency(estimatedMonthlyRepayment)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Monthly Expenses</p>
                <p className="text-xl">{formatCurrency(estimatedMonthlyExpenses)}</p>
              </div>
              <div className="pt-2 border-t">
                <p className="text-sm text-gray-500">Total Monthly Vehicle Costs</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(estimatedMonthlyRepayment + estimatedMonthlyExpenses)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Target: {formatCurrency(parseFloat(netSalary || 0) * (budgetPercentage / 100))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {affordableCarPrice > 0 && (
          <Button 
            onClick={handleGenerateReport}
            variant="outline" 
            className="w-full mt-4"
          >
            {user && subscription ? 'Generate Detailed Report' : 'Upgrade to Generate Report'}
          </Button>
        )}
      </div>

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
    </div>
  );
};

export default VehicleCostCalculator;