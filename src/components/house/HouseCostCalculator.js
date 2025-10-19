import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext'; // Add this import
import { useToast } from '../ui/use-toast';
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import NickleLogo from '../../assets/nickle-logo.png';
import { PremiumDialog } from '../premium';
import { SaveDialog } from '../premium/SaveDialog';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';

// Import components
import BasicInformation from './components/BasicInformation';
import MonthlyExpenses from './components/MonthlyExpenses';
import LoanDetails from './components/LoanDetails';
import ResultsEnhanced from './component</ResultsEnhanced>nhanced';
import SavedCalculations from './components/SavedCalculations';
import CalculateButton from './components/CalculateButton';
import ReportButton from '../../components/shared/ReportButton';

import { calculateTransferDuty, calculateMonthlyRepayment } from './utils/calculations';
import { formatCurrency } from './utils/formatters';
import { generateHouseReport } from './utils/report-generator';
import { DEFAULT_EXPENSES } from './constants/house-defaults';

const HouseCostCalculator = ({ onBack, initialNetSalary = '', initialBudgetPercentage = 30 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); // Only get user from auth context
  const { subscription } = useSubscription(); // Get subscription from subscription context
  const { toast } = useToast();
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  // Basic state
  const [netSalary, setNetSalary] = useState(initialNetSalary || location.state?.netSalary || '');
  const [budgetPercentage, setBudgetPercentage] = useState(
    initialBudgetPercentage || location.state?.budgetPercentage || 30
  );
  
  // Expenses state
  const [expenses, setExpenses] = useState(DEFAULT_EXPENSES);
  const [newExpense, setNewExpense] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  
  // Results state
  const [affordableHousePrice, setAffordableHousePrice] = useState(0);
  const [downPayment, setDownPayment] = useState(0);
  const [estimatedMonthlyRepayment, setEstimatedMonthlyRepayment] = useState(0);
  const [estimatedMonthlyExpenses, setEstimatedMonthlyExpenses] = useState(0);
  
  // Loan details state
  const [downPaymentPercentage, setDownPaymentPercentage] = useState(10);
  const [term, setTerm] = useState(240);
  const [interestRate, setInterestRate] = useState(10);
  const [bondInitiationFee] = useState(7000);
  const [bondRegistrationRate] = useState(2);
  
  // Premium feature states
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [savedCalculations, setSavedCalculations] = useState([]);

  useEffect(() => {
    if (user && subscription?.status && ['active', 'trialing'].includes(subscription.status)) {
      loadSavedCalculations();
    }
  }, [user, subscription]);

  useEffect(() => {
    try {
      const savedExpenses = localStorage.getItem('houseExpenses');
      if (savedExpenses) {
        setExpenses(JSON.parse(savedExpenses));
      }
    } catch (error) {
      console.error('Error loading saved expenses:', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('houseExpenses', JSON.stringify(expenses));
    } catch (error) {
      console.error('Error saving expenses:', error);
    }
  }, [expenses]);

  const loadSavedCalculations = async () => {
    try {
      setIsLoading(true);
      const calculationsRef = collection(db, 'calculations');
      const q = query(
        calculationsRef,
        where('userId', '==', user.uid),
        where('type', '==', 'house'),
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
      toast({
        title: "Error",
        description: "Failed to load saved calculations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExpense = () => {
    try {
      if (!newExpense.trim()) {
        toast({
          title: "Invalid Input",
          description: "Please enter an expense name",
          variant: "destructive",
        });
        return;
      }

      if (!newExpenseAmount || isNaN(Number(newExpenseAmount)) || Number(newExpenseAmount) <= 0) {
        toast({
          title: "Invalid Input",
          description: "Please enter a valid expense amount",
          variant: "destructive",
        });
        return;
      }

      setExpenses(prev => [
        ...prev,
        { 
          name: newExpense.trim(), 
          amount: Number(newExpenseAmount), 
          type: 'custom' 
        }
      ]);
      
      setNewExpense('');
      setNewExpenseAmount('');

      toast({
        title: "Success",
        description: "Expense added successfully",
      });
    } catch (error) {
      console.error('Error adding expense:', error);
      toast({
        title: "Error",
        description: "Failed to add expense",
        variant: "destructive",
      });
    }
  };

  const handleRemoveExpense = (index) => {
    try {
      const newExpenses = [...expenses];
      newExpenses.splice(index, 1);
      setExpenses(newExpenses);
      toast({
        title: "Success",
        description: "Expense removed successfully",
      });
    } catch (error) {
      console.error('Error removing expense:', error);
      toast({
        title: "Error",
        description: "Failed to remove expense",
        variant: "destructive",
      });
    }
  };

  const handleCalculate = async () => {
    try {
      setIsCalculating(true);

      const parsedSalary = Number(netSalary);
      if (!parsedSalary || parsedSalary <= 0) {
        toast({
          title: "Invalid Input",
          description: "Please enter a valid net salary amount",
          variant: "destructive",
        });
        return;
      }

      if (!budgetPercentage || budgetPercentage <= 0 || budgetPercentage > 100) {
        toast({
          title: "Invalid Input",
          description: "Please enter a valid budget percentage between 1 and 100",
          variant: "destructive",
        });
        return;
      }

      const monthlyBudget = parsedSalary * (budgetPercentage / 100);
      
      const totalMonthlyExpenses = expenses.reduce((sum, expense) => {
        const amount = Number(expense.amount) || 0;
        if (amount < 0) throw new Error('Expense amounts cannot be negative');
        return sum + amount;
      }, 0);
      
      setEstimatedMonthlyExpenses(totalMonthlyExpenses);

      const availableForRepayment = monthlyBudget - totalMonthlyExpenses;
      
      if (availableForRepayment <= 0) {
        toast({
          title: "Budget Error",
          description: "Your expenses exceed your budget. Please review your expenses.",
          variant: "destructive",
        });
        return;
      }

      if (!validateLoanParameters()) return;

      const monthlyRate = interestRate / 12 / 100;
      const loanAmount = availableForRepayment * 
        (Math.pow(1 + monthlyRate, term) - 1) / 
        (monthlyRate * Math.pow(1 + monthlyRate, term));

      const totalPrice = loanAmount / (1 - (downPaymentPercentage / 100));
      const calculatedDownPayment = totalPrice * (downPaymentPercentage / 100);

      const monthlyRepayment = calculateMonthlyRepayment(
        totalPrice - calculatedDownPayment,
        term / 12,
        interestRate
      );

      setAffordableHousePrice(Math.round(totalPrice));
      setDownPayment(Math.round(calculatedDownPayment));
      setEstimatedMonthlyRepayment(Math.round(monthlyRepayment));

      toast({
        title: "Success",
        description: "Calculation completed successfully",
      });

    } catch (error) {
      console.error('Calculation error:', error);
      toast({
        title: "Calculation Error",
        description: error.message || 'There was an error in the calculation. Please check your inputs.',
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const validateLoanParameters = () => {
    const validatedInterestRate = Number(interestRate);
    if (!validatedInterestRate || validatedInterestRate <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid interest rate greater than 0",
        variant: "destructive",
      });
      return false;
    }

    const validatedTerm = Number(term);
    if (!validatedTerm || validatedTerm <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid loan term greater than 0",
        variant: "destructive",
      });
      return false;
    }

    const validatedDownPaymentPercentage = Number(downPaymentPercentage);
    if (!validatedDownPaymentPercentage || validatedDownPaymentPercentage < 0 || validatedDownPaymentPercentage >= 100) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid down payment percentage between 0 and 100",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleGenerateReport = async () => {
    try {
      setIsGeneratingReport(true);
      
      const logo = await fetch(NickleLogo)
        .then(res => res.blob())
        .then(blob => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
        });
  
      // Calculate transfer duty here to ensure it's a number
      const transferDuty = calculateTransferDuty(parseFloat(affordableHousePrice));
      const bondRegistrationCost = (affordableHousePrice - parseFloat(downPayment)) * (bondRegistrationRate / 100);
  
      generateHouseReport({
        logoBase64: logo,
        netSalary: parseFloat(netSalary),
        budgetPercentage,
        affordableHousePrice,
        downPayment,
        term,
        interestRate,
        estimatedMonthlyRepayment,
        estimatedMonthlyExpenses,
        bondRegistrationRate,
        bondInitiationFee,
        expenses,
        // Send the calculated values instead of the function
        transferDuty: transferDuty,
        bondRegistrationCost: bondRegistrationCost
      });
  
      toast({
        title: "Success",
        description: "Report generated successfully",
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleSaveClick = () => {
    if (!user) {
      setShowPremiumDialog(true);
      return;
    }

    if (!subscription?.status || !['active', 'trialing'].includes(subscription.status)) {
      setShowPremiumDialog(true);
      return;
    }

    setShowSaveDialog(true);
  };

  const saveCalculation = async (name) => {
    if (!user || !subscription?.status || !['active', 'trialing'].includes(subscription.status)) return;

    try {
      setIsSaving(true);
      const calculationData = {
        userId: user.uid,
        type: 'house',
        name,
        createdAt: new Date().toISOString(),
        data: {
          netSalary,
          budgetPercentage,
          expenses,
          affordableHousePrice,
          downPayment,
          downPaymentPercentage,
          term,
          interestRate,
          estimatedMonthlyRepayment,
          estimatedMonthlyExpenses,
          bondInitiationFee,
          bondRegistrationRate
        }
      };

      await addDoc(collection(db, 'calculations'), calculationData);
      await loadSavedCalculations();
      setShowSaveDialog(false);
      
      toast({
        title: "Success",
        description: "Calculation saved successfully",
      });
    } catch (error) {
      console.error('Error saving calculation:', error);
      toast({
        title: "Error",
        description: "Failed to save calculation",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const loadCalculation = (calculation) => {
    try {
      const data = calculation.data;
      setNetSalary(data.netSalary);
      setBudgetPercentage(data.budgetPercentage);
      setExpenses(data.expenses);
      setDownPaymentPercentage(data.downPaymentPercentage);
      setTerm(data.term);
      setInterestRate(data.interestRate);
      setAffordableHousePrice(data.affordableHousePrice);
      setDownPayment(data.downPayment);
      setEstimatedMonthlyRepayment(data.estimatedMonthlyRepayment);
      setEstimatedMonthlyExpenses(data.estimatedMonthlyExpenses);

      toast({
        title: "Success",
        description: "Calculation loaded successfully",
      });
    } catch (error) {
      console.error('Error loading calculation:', error);
      toast({
        title: "Error",
        description: "Failed to load calculation",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">House Cost Calculator</h1>
        <p className="text-gray-600">Smart Budgets Meet Big Ambitions</p>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          ← Back to Budget Planner
        </button>
        {affordableHousePrice > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveClick}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              user && (subscription?.status === 'active' || subscription?.status === 'trialing')
                ? 'Save Calculation' 
                : 'Upgrade to Save'
            )}
          </Button>
        )}
      </div>

      <p className="text-gray-600">
        Calculate your maximum house budget while keeping total monthly costs at {budgetPercentage}% of your salary
      </p>

      {user && subscription?.status && ['active', 'trialing'].includes(subscription.status) && (
        <SavedCalculations
          calculations={savedCalculations}
          onLoadCalculation={loadCalculation}
          loading={isLoading}
        />
      )}

      <div className="space-y-6">
        <BasicInformation
          netSalary={netSalary}
          setNetSalary={setNetSalary}
          budgetPercentage={budgetPercentage}
          setBudgetPercentage={setBudgetPercentage}
        />

        <MonthlyExpenses
          expenses={expenses}
          setExpenses={setExpenses}
          handleAddExpense={handleAddExpense}
          handleRemoveExpense={handleRemoveExpense}
          newExpense={newExpense}
          setNewExpense={setNewExpense}
          newExpenseAmount={newExpenseAmount}
          setNewExpenseAmount={setNewExpenseAmount}
          netSalary={parseFloat(netSalary)}
          budgetPercentage={budgetPercentage}
        />

        <LoanDetails
          downPaymentPercentage={downPaymentPercentage}
          setDownPaymentPercentage={setDownPaymentPercentage}
          term={term}
          setTerm={setTerm}
          interestRate={interestRate}
          setInterestRate={setInterestRate}
        />

        <CalculateButton
          onClick={handleCalculate}
          loading={isCalculating}
          disabled={!netSalary || !budgetPercentage || isCalculating}
        />

        {affordableHousePrice > 0 && (
          <>
            <ResultsEnhanced
              affordableHousePrice={affordableHousePrice}
              downPayment={downPayment}
              estimatedMonthlyRepayment={estimatedMonthlyRepayment}
              estimatedMonthlyExpenses={estimatedMonthlyExpenses}
              netSalary={netSalary}
              bondInitiationFee={bondInitiationFee}
              bondRegistrationRate={bondRegistrationRate}
              formatCurrency={formatCurrency}
            />
            <ReportButton
              onClick={handleGenerateReport}
              user={user}
              subscription={subscription}
              isLoading={isGeneratingReport}
              type="house"
              disabled={!affordableHousePrice}
            />
          </>
        )}
      </div>

      <PremiumDialog
        isOpen={showPremiumDialog}
        onClose={() => setShowPremiumDialog(false)}
        isRegistering={!user}
      />

      <SaveDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSave={saveCalculation}
        loading={isSaving}
        type="house"
      />

      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span>Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseCostCalculator;
