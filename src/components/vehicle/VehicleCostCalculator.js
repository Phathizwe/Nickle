import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext'; // Add this import
import { useToast } from "../ui/use-toast";
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
import PurchaseDecisions from './components/PurchaseDecisions';
import ResultsEnhanced from './components</ResultsEnhanced>hanced';
import SavedCalculations from './components/SavedCalculations';
import ReportButton from '../../components/shared/ReportButton';

// Import utilities and constants
import { calculateAffordablePrice, calculateMonthlyRepayment } from './utils/calculations';
import { generateVehicleReport } from './utils/report-generator';
import { DEFAULT_VALUES, DEFAULT_EXPENSES } from './constants/vehicle-defaults';

const VehicleCostCalculator = ({ onBack, initialNetSalary = '', initialBudgetPercentage = 30 }) => {
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
  
  // Get initial values from navigation state or localStorage
  const [netSalary, setNetSalary] = useState(() => {
    return initialNetSalary || 
           location.state?.netSalary || 
           localStorage.getItem('vehicle_net_salary') || 
           '';
  });

  const [budgetPercentage, setBudgetPercentage] = useState(() => {
    return initialBudgetPercentage || 
           location.state?.budgetPercentage || 
           Number(localStorage.getItem('vehicle_budget_percentage')) || 
           DEFAULT_VALUES.budgetPercentage;
  });
  
  // Monthly Vehicle Expenses - Initialize with defaults
  const [insurance, setInsurance] = useState(() => {
    return localStorage.getItem('vehicle_insurance') || DEFAULT_EXPENSES.insurance;
  });

  const [petrol, setPetrol] = useState(() => {
    return localStorage.getItem('vehicle_petrol') || DEFAULT_EXPENSES.petrol;
  });

  const [additionalExpenses, setAdditionalExpenses] = useState(() => {
    const saved = localStorage.getItem('vehicle_additional_expenses');
    return saved ? JSON.parse(saved) : DEFAULT_EXPENSES.additional;
  });

  const [newExpense, setNewExpense] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  
  // Vehicle Purchasing Decisions
  const [affordableCarPrice, setAffordableCarPrice] = useState('0.00');
  const [deposit, setDeposit] = useState('0');
  const [term, setTerm] = useState(DEFAULT_VALUES.term);
  const [interestRate, setInterestRate] = useState(DEFAULT_VALUES.interestRate);
  const [balloonPayment, setBalloonPayment] = useState(DEFAULT_VALUES.balloonPayment);
  const [estimatedMonthlyRepayment, setEstimatedMonthlyRepayment] = useState(0);
  const [estimatedMonthlyExpenses, setEstimatedMonthlyExpenses] = useState(0);

  // Premium feature states
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [savedCalculations, setSavedCalculations] = useState([]);

  useEffect(() => {
    localStorage.setItem('vehicle_net_salary', netSalary);
    localStorage.setItem('vehicle_budget_percentage', budgetPercentage.toString());
    localStorage.setItem('vehicle_insurance', insurance);
    localStorage.setItem('vehicle_petrol', petrol);
    localStorage.setItem('vehicle_additional_expenses', JSON.stringify(additionalExpenses));
  }, [netSalary, budgetPercentage, insurance, petrol, additionalExpenses]);

  useEffect(() => {
    if (user && subscription?.status && ['active', 'trialing'].includes(subscription.status)) {
      loadSavedCalculations();
    }
  }, [user, subscription]);

  const loadSavedCalculations = async () => {
    try {
      setIsLoading(true);
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
      toast({
        title: "Error",
        description: "Failed to load saved calculations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCalculate = () => {
    try {
      setIsCalculating(true);

      if (!validateInputs()) return;

      const totalMonthlyExpenses = calculateTotalMonthlyExpenses();
      setEstimatedMonthlyExpenses(totalMonthlyExpenses);

      const price = calculateAffordablePrice({
        netSalary,
        budgetPercentage,
        monthlyExpenses: totalMonthlyExpenses,
        deposit,
        term,
        interestRate,
        balloonPayment,
      });

      setAffordableCarPrice(price.toFixed(2));
      
      const monthlyRepayment = calculateMonthlyRepayment(
        price,
        deposit,
        interestRate,
        term,
        balloonPayment
      );
      
      setEstimatedMonthlyRepayment(monthlyRepayment);

      toast({
        title: "Success",
        description: "Calculation completed successfully",
      });
    } catch (error) {
      console.error('Calculation error:', error);
      toast({
        title: "Error",
        description: "Failed to calculate. Please check your inputs.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const validateInputs = () => {
    if (!netSalary || parseFloat(netSalary) <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid net salary",
        variant: "destructive",
      });
      return false;
    }

    if (!budgetPercentage || budgetPercentage <= 0 || budgetPercentage > 100) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid budget percentage between 1 and 100",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const calculateTotalMonthlyExpenses = () => {
    return parseFloat(insurance || 0) + 
           parseFloat(petrol || 0) + 
           additionalExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
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

      generateVehicleReport({
        logoBase64: logo,
        netSalary,
        budgetPercentage,
        affordableCarPrice,
        deposit,
        term,
        interestRate,
        balloonPayment,
        estimatedMonthlyRepayment,
        estimatedMonthlyExpenses,
        insurance,
        petrol,
        additionalExpenses
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

  const handleBack = () => {
    navigate('/', {
      state: {
        netSalary,
        budgetPercentage
      }
    });
  };

  const saveCalculation = async (name) => {
    if (!user || !subscription?.status || !['active', 'trialing'].includes(subscription.status)) return;

    try {
      setIsSaving(true);
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
      setNetSalary(data.netSalary || '');
      setBudgetPercentage(data.budgetPercentage || DEFAULT_VALUES.budgetPercentage);
      setInsurance(data.insurance || DEFAULT_EXPENSES.insurance);
      setPetrol(data.petrol || DEFAULT_EXPENSES.petrol);
      setAdditionalExpenses(data.additionalExpenses || DEFAULT_EXPENSES.additional);
      setDeposit(data.deposit || '0');
      setTerm(data.term || DEFAULT_VALUES.term);
      setInterestRate(data.interestRate || DEFAULT_VALUES.interestRate);
      setBalloonPayment(data.balloonPayment || DEFAULT_VALUES.balloonPayment);
      setAffordableCarPrice(data.affordableCarPrice || '0.00');
      setEstimatedMonthlyRepayment(data.estimatedMonthlyRepayment || 0);
      setEstimatedMonthlyExpenses(data.estimatedMonthlyExpenses || 0);

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
        {affordableCarPrice > 0 && (
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
              user && subscription?.status && ['active', 'trialing'].includes(subscription.status) 
                ? 'Save Calculation' 
                : 'Upgrade to Save'
            )}
          </Button>
        )}
      </div>

      <p className="text-gray-600">
        Calculate your maximum car budget while keeping total monthly costs at {budgetPercentage}% of your salary
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
          insurance={insurance}
          setInsurance={setInsurance}
          petrol={petrol}
          setPetrol={setPetrol}
          additionalExpenses={additionalExpenses}
          setAdditionalExpenses={setAdditionalExpenses}
          newExpense={newExpense}
          setNewExpense={setNewExpense}
          newExpenseAmount={newExpenseAmount}
          setNewExpenseAmount={setNewExpenseAmount}
          netSalary={parseFloat(netSalary)}
          budgetPercentage={budgetPercentage}
        />

        <PurchaseDecisions
          deposit={deposit}
          setDeposit={setDeposit}
          term={term}
          setTerm={setTerm}
          interestRate={interestRate}
          setInterestRate={setInterestRate}
          balloonPayment={balloonPayment}
          setBalloonPayment={setBalloonPayment}
          affordableCarPrice={affordableCarPrice}
        />

        <Button 
          onClick={handleCalculate} 
          className="w-full"
          disabled={isCalculating}
        >
          {isCalculating ? 'Calculating...' : 'Calculate Maximum Car Budget'}
        </Button>

        {affordableCarPrice > 0 && (
          <>
            <ResultsEnhanced
              affordableCarPrice={affordableCarPrice}
              estimatedMonthlyRepayment={estimatedMonthlyRepayment}
              estimatedMonthlyExpenses={estimatedMonthlyExpenses}
              netSalary={netSalary}
              budgetPercentage={budgetPercentage}
            />
            <ReportButton
              onClick={handleGenerateReport}
              user={user}
              subscription={subscription}
              isLoading={isGeneratingReport}
              type="vehicle"
              disabled={!affordableCarPrice}
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
        type="vehicle"
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

export default VehicleCostCalculator;
