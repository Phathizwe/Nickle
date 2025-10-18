import React, { useState, useEffect } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import { useToast } from './components/ui/use-toast';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HomePage from './components/home/HomePage';
import HouseCostCalculator from './components/house/HouseCostCalculator';
import VehicleCostCalculator from './components/vehicle/VehicleCostCalculator';
import About from './components/pages/About';
import Contact from './components/pages/Contact';
import Privacy from './components/pages/Privacy';
import Terms from './components/pages/Terms';
import Pricing from './components/pages/Pricing';
import Start from './components/pages/Start';
import Header from './components/Header';
import Footer from './components/Footer';
import { Toaster } from './components/ui/toaster';
import { AuthProvider, useAuth } from './components/auth/AuthProvider';
import { SubscriptionProvider } from './components/contexts/SubscriptionContext';
import LayoutWrapper from './components/layouts/LayoutWrapper';

// Create a route that shows Start for non-authenticated users and redirects to Home for authenticated users
const LandingRoute = () => {
  const { user } = useAuth();
  
  if (user) {
    // User is signed in, redirect to Home page
    return <Navigate to="/home" replace />;
  }
  
  // User is not signed in, show Start page
  return <Start />;
  };

function AppContent() {
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  // Initialize salary state from location state or localStorage
  const [netSalary, setNetSalary] = useState(() => {
    // First priority: Check URL state
    if (location.state?.netSalary) {
      return location.state.netSalary.toString();
    }
    
    // Second priority: Check localStorage
    const storedSalary = localStorage.getItem('initialNetSalary');
    if (storedSalary) {
      return storedSalary;
    }
    
    // Default
    return '';
  });
  
  const [budgetPercentage, setBudgetPercentage] = useState(30);

  // Watch for changes in location.state
  useEffect(() => {
    if (location.state?.netSalary) {
      console.log('Setting netSalary from location state:', location.state.netSalary);
      setNetSalary(location.state.netSalary.toString());
      
      // Store in localStorage as backup
      localStorage.setItem('initialNetSalary', location.state.netSalary.toString());
    }
  }, [location.state]);

  const handleSelectCalculator = (type, salary, percentage) => {
    try {
      // Validate inputs before setting state
      const validSalary = typeof salary === 'number' && !isNaN(salary) ? salary : '';
      const validPercentage = typeof percentage === 'number' && !isNaN(percentage) && percentage > 0 && percentage <= 100 ? percentage : 30;
      setNetSalary(validSalary);
      setBudgetPercentage(validPercentage);
    } catch (error) {
      console.error('Error selecting calculator:', error);
      toast({
        title: 'Error',
        description: 'Failed to update calculator settings. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleBackToHome = (updatedSalary, updatedPercentage) => {
    try {
      // Validate inputs before setting state
      const validSalary = typeof updatedSalary === 'number' && !isNaN(updatedSalary) ? updatedSalary : '';
      const validPercentage = typeof updatedPercentage === 'number' && !isNaN(updatedPercentage) && updatedPercentage > 0 && updatedPercentage <= 100 ? updatedPercentage : 30;
      setNetSalary(validSalary);
      setBudgetPercentage(validPercentage);
    } catch (error) {
      console.error('Error updating home values:', error);
      toast({
        title: 'Error',
        description: 'Failed to update values. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <Routes>
          {/* Landing page route - shows Start for non-authenticated users, redirects to Home for authenticated users */}
          <Route path="/" element={<LandingRoute />} />
                  
                  {/* Home page route - accessible to everyone */}
                  <Route 
                    path="/home" 
                    element={
                      <LayoutWrapper>
                        <HomePage 
                          netSalary={netSalary}
                          setNetSalary={setNetSalary}
                          budgetPercentage={budgetPercentage}
                          setBudgetPercentage={setBudgetPercentage}
                        onSelectCalculator={handleSelectCalculator}
                      />
                      </LayoutWrapper>
                    } 
                  />
          
          {/* Calculator routes */}
                  <Route 
                    path="/house-calculator" 
                    element={
                      <LayoutWrapper>
                        <HouseCostCalculator 
                          netSalary={netSalary}
                          budgetPercentage={budgetPercentage}
                          onBackToHome={handleBackToHome}
                        />
                      </LayoutWrapper>
                    } 
                  />

                  <Route 
                    path="/vehicle-calculator" 
                    element={
                      <LayoutWrapper>
                        <VehicleCostCalculator 
                          netSalary={netSalary}
                        budgetPercentage={budgetPercentage}
                        onBackToHome={handleBackToHome}
                      />
                      </LayoutWrapper>
                    } 
                  />
          
          {/* Static pages - Directly wrap these with LayoutWrapper */}
                  <Route path="/about" element={<LayoutWrapper><About /></LayoutWrapper>} />
                  <Route path="/contact" element={<LayoutWrapper><Contact /></LayoutWrapper>} />
                  <Route path="/privacy" element={<LayoutWrapper><Privacy /></LayoutWrapper>} />
                  <Route path="/terms" element={<LayoutWrapper><Terms /></LayoutWrapper>} />
                  <Route path="/pricing" element={<LayoutWrapper><Pricing /></LayoutWrapper>} />
                </Routes>
              </main>
              <Footer />
            </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SubscriptionProvider>
          <Router>
            <AppContent />
          </Router>
          <Toaster />
        </SubscriptionProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;