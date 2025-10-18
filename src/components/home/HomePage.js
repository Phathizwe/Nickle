import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useToast } from '../ui/use-toast';
import { budgetService } from '../services/budgetService';
import BudgetChart from './components/BudgetChart';
import { BudgetInput } from './components/BudgetInput';
import { PresetSelection } from './components/PresetSelection';
import { LoadBudgetDialog } from './LoadBudgetDialog';
import { PremiumDialog, PremiumFeatureDialog } from '../premium';
import { SaveDialog } from '../premium/SaveDialog';
import { BUDGET_PRESETS } from './constants/budget-presets';
import { Button } from '../ui/button';
import { FolderOpen, Loader2 } from 'lucide-react';

const HomePage = ({ netSalary, setNetSalary, budgetPercentage, setBudgetPercentage, onSelectCalculator, ...otherProps }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const { toast } = useToast();
  
  const [categories, setCategories] = useState(BUDGET_PRESETS.balanced);
  const [selectedPreset, setSelectedPreset] = useState('balanced');
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedBudgets, setSavedBudgets] = useState([]);

  // Dialog states
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Load saved budgets for premium users
  useEffect(() => {
    const isSubscribed = subscription?.status === 'active' || subscription?.status === 'trialing';
    if (user && isSubscribed) {
          loadSavedBudgets();
    }
  }, [user, subscription]);

  // Load from localStorage for non-premium users
  useEffect(() => {
    const isSubscribed = subscription?.status === 'active' || subscription?.status === 'trialing';
    if (!user || !isSubscribed) {
      const savedData = localStorage.getItem('budgetPlanner');
      if (savedData) {
        try {
          const { categories: savedCategories, salary: savedSalary } = JSON.parse(savedData);
          if (savedCategories) setCategories(savedCategories);
          if (savedSalary) setNetSalary(savedSalary);
        } catch (error) {
          console.error('Error loading saved data:', error);
        }
      }
    }
  }, [user, subscription]);

  // Save to localStorage for non-premium users
  useEffect(() => {
    const isSubscribed = subscription?.status === 'active' || subscription?.status === 'trialing';
    if (!user || !isSubscribed) {
      if (netSalary || categories.length > 0) {
        localStorage.setItem('budgetPlanner', JSON.stringify({
          categories,
          salary: netSalary
        }));
      }
    }
  }, [categories, netSalary, user, subscription]);

  const loadSavedBudgets = async () => {
    try {
      setLoading(true);
      const budgets = await budgetService.getBudgets(user.uid);
      setSavedBudgets(budgets);
    } catch (error) {
      console.error('Error loading budgets:', error);
      toast({
        title: "Error",
        description: "Failed to load saved budgets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
};

  const checkPremiumAccess = () => {
    if (!user) {
      setIsRegistering(true);
      setShowPremiumDialog(true);
      return false;
    }
    
    const isSubscribed = subscription?.status === 'active' || subscription?.status === 'trialing';
    if (!isSubscribed) {
      setShowUpgradeDialog(true);
      return false;
    }
    
    return true;
  };

  const handleUpdateCategory = (category, newValue) => {
    setCategories(prevCategories =>
      prevCategories.map(cat =>
        cat.name === category.name
          ? { ...cat, percentage: newValue }
          : cat
      )
    );
  };

  const handleCategoryClick = async (category) => {
    if (!netSalary) {
      toast({
        title: "Error",
        description: "Please enter your net salary first",
        variant: "destructive",
      });
      return;
    }

    const isCalculatable = category.type === 'housing' || category.type === 'vehicle';
    if (!isCalculatable) return;

    try {
      setLoading(true);
      const currentCategory = categories.find(cat => cat.type === category.type);
      
      if (!currentCategory) {
        console.error('Category not found:', category.type);
        return;
      }

      // Updated path to match the routes in App.js
      const path = category.type === 'housing'
        ? '/house-calculator'
        : '/vehicle-calculator';
      
      navigate(path, {
        state: {
          netSalary: parseFloat(netSalary),
          budgetPercentage: currentCategory.percentage
        }
      });

    } catch (error) {
      console.error('Navigation error:', error);
      toast({
        title: "Error",
        description: "Failed to load calculator",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClick = () => {
    if (checkPremiumAccess()) {
      setShowSaveDialog(true);
    }
  };

  const handleLoadClick = () => {
    if (checkPremiumAccess()) {
      setShowLoadDialog(true);
    }
  };

  const handleLoadBudget = (budget) => {
    try {
      setNetSalary(budget.data.salary || '');
      setCategories(budget.data.categories || BUDGET_PRESETS.balanced);
      setShowLoadDialog(false);
      
      toast({
        title: "Success",
        description: "Budget loaded successfully",
      });
    } catch (error) {
      console.error('Error loading budget:', error);
      toast({
        title: "Error",
        description: "Failed to load budget",
        variant: "destructive",
      });
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

  return (
    <div className="space-y-4 md:space-y-8">
      {/* Top Actions */}
      <div className="flex justify-end gap-2">
        {netSalary && (
          <>
            <Button
              onClick={handleLoadClick}
              variant="outline"
              className="text-gray-700"
              disabled={loading}
            >
              <FolderOpen className="mr-2 h-4 w-4" />
              Load Budget
            </Button>
            <Button
              onClick={handleSaveClick}
              variant="outline"
              className="text-gray-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                user && (subscription?.status === 'active' || subscription?.status === 'trialing')
                  ? 'Save Budget'
                  : 'Upgrade to Save'
              )}
            </Button>
          </>
        )}
      </div>

      {/* Budget Input */}
      <BudgetInput
        netSalary={netSalary}
        setNetSalary={setNetSalary}
      />

      {/* Budget Components */}
      {netSalary && (
        <>
          <PresetSelection
            selectedPreset={selectedPreset}
            onPresetSelect={(preset) => {
              setSelectedPreset(preset);
              setCategories(BUDGET_PRESETS[preset]);
            }}
            netSalary={parseFloat(netSalary)}
            formatCurrency={formatCurrency}
          />

          <BudgetChart
            categories={categories}
            hoveredCategory={hoveredCategory}
            onHover={setHoveredCategory}
            onClick={handleCategoryClick}
            formatCurrency={formatCurrency}
            netSalary={netSalary}
            onUpdateCategory={handleUpdateCategory}
          />
        </>
      )}

      {/* Dialogs */}
      <PremiumDialog
        isOpen={showPremiumDialog}
        onClose={() => setShowPremiumDialog(false)}
        isRegistering={isRegistering}
        onSuccess={() => {
          setShowPremiumDialog(false);
          if (isRegistering) {
            setShowUpgradeDialog(true);
          }
        }}
      />

      <PremiumFeatureDialog
        isOpen={showUpgradeDialog}
        onClose={() => setShowUpgradeDialog(false)}
        onSuccess={() => {
          setShowUpgradeDialog(false);
          setShowSaveDialog(true);
        }}
      />

      <SaveDialog
        isOpen={showSaveDialog}
        onClose={() => {
          setShowSaveDialog(false);
          loadSavedBudgets();
        }}
        type="budget"
        initialData={{
          categories,
          salary: netSalary,
        }}
      />

      <LoadBudgetDialog
        isOpen={showLoadDialog}
        onClose={() => setShowLoadDialog(false)}
        budgets={savedBudgets}
        onLoadBudget={handleLoadBudget}
        loading={loading}
      />

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span>Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
