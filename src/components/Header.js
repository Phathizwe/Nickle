// src/components/Header.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useSubscription } from './contexts/SubscriptionContext';
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useToast } from './ui/use-toast';
import { Loader2, Crown, AlertTriangle, Clock } from "lucide-react";
import NickleLogo from '../assets/nickle-logo.png';
import { PremiumDialog, PremiumFeatureDialog } from './premium';
import { cn } from '../lib/utils';

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 rounded-md ${
        isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
      }`}
    >
      {children}
    </Link>
  );
};

const getSubscriptionStatus = (subscription) => {
  if (!subscription) return { 
    type: 'none', 
    label: '', 
    icon: null,
    bgColor: '',
    textColor: ''
  };
  
  const now = new Date();
  const trialEnd = subscription.trialEndDate ? new Date(subscription.trialEndDate) : null;
  const nextBilling = subscription.nextBillingDate ? new Date(subscription.nextBillingDate) : null;

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  switch (subscription.status) {
    case 'trialing':
      return {
        type: 'trial',
        label: 'Trial Active',
        subLabel: `Trial ends ${formatDate(trialEnd)}`,
        icon: Clock,
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700'
      };
    case 'active':
      return {
        type: 'premium',
        label: subscription.billingType === 'annual' ? 'Premium Annual' : 'Premium Monthly',
        subLabel: `Next billing ${formatDate(nextBilling)}`,
        icon: Crown,
        bgColor: 'bg-green-50',
        textColor: 'text-green-700'
      };
    case 'cancelled':
      return {
        type: 'cancelled',
        label: 'Premium (Cancelled)',
        subLabel: `Access until ${formatDate(subscription.accessEndDate)}`,
        icon: AlertTriangle,
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-700'
      };
    case 'past_due':
      return {
        type: 'past_due',
        label: 'Payment Past Due',
        subLabel: 'Please update payment method',
        icon: AlertTriangle,
        bgColor: 'bg-red-50',
        textColor: 'text-red-700'
      };
    default:
      return {
        type: 'none',
        label: '',
        subLabel: '',
        icon: null,
        bgColor: '',
        textColor: ''
      };
  }
};

const SubscriptionBadge = ({ status }) => {
  if (!status.type || status.type === 'none') return null;

  const Icon = status.icon;
  
  return (
    <div className="flex items-center justify-between w-full">
      <div className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
        status.bgColor,
        status.textColor
      )}>
        {Icon && <Icon className="h-3 w-3" />}
        <span>{status.label}</span>
      </div>

      {/* Price display for active subscriptions */}
      {status.type === 'premium' && (
        <span className="text-xs text-gray-500">
          {status.label.includes('Annual') ? 'R9.99/mo' : 'R14.99/mo'}
        </span>
      )}
    </div>
  );
};

const Header = () => {
  const { user, signOut } = useAuth();
  const { subscription, isSubscribed, isTrialing, loading: subscriptionLoading } = useSubscription();
  const { toast } = useToast();
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  const subscriptionStatus = getSubscriptionStatus(subscription);
  const shouldShowUpgradeButton = user && 
    !subscriptionLoading && 
    !isTrialing && 
    subscriptionStatus.type !== 'premium' && 
    subscriptionStatus.type !== 'trial';

  const handleAuthClick = (registering = false) => {
    setIsRegistering(registering);
    setShowPremiumDialog(true);
  };

  const handleDialogClose = () => {
    setShowPremiumDialog(false);
    setIsRegistering(false);
  };

  const handleUpgradeClick = () => {
    if (!user) {
      setIsRegistering(true);
      setShowPremiumDialog(true);
    } else {
      setShowUpgradeDialog(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowPremiumDialog(false);
    if (isRegistering) {
      setShowUpgradeDialog(true);
    }
  };

  const handleUpgradeSuccess = () => {
    setShowUpgradeDialog(false);
    toast({
      title: "Success",
      description: "Your premium subscription is now active!",
    });
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50">
    {/* Soft Launch Banner with Feedback */}
      <a 
        href="mailto:nickle@hinas.co.za?subject=Nickle Feedback - Test Mode"
        className="
          block bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-2 
          text-sm text-center transition-all duration-200 
          hover:from-blue-700 hover:to-blue-500 cursor-pointer
          group
        "
      >
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="font-medium">Soft Launch - Test Mode</span>
          <span className="hidden sm:inline text-blue-100">•</span>
          <span className="hidden sm:inline text-blue-100 group-hover:text-white group-hover:underline">
            Click here to send feedback
          </span>
        </div>
      </a>
      
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src={NickleLogo} 
                alt="Nickle Logo" 
                className="w-8 h-8" 
              />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Nickle</h1>
                <p className="text-xs text-gray-600">Smart Budgets Meet Big Ambitions</p>
              </div>
            </Link>
          </div>

          {/* Main Navigation - UPDATED PATHS */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/vehicle-calculator">Vehicle Calculator</NavLink>
            <NavLink to="/house-calculator">House Calculator</NavLink>
            <NavLink to="/pricing">Pricing</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2">
            {!user && !loading && (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => handleAuthClick(false)}
                  className="text-sm"
                  disabled={loading}
                >
                  Sign In
                </Button>
                <Button 
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-sm"
                  onClick={() => handleAuthClick(true)}
                  disabled={loading}
                >
                  Register
                </Button>
              </>
            )}

            {/* Upgrade Button with Transition */}
            <div className={cn(
              "transition-all duration-200 ease-in-out",
              shouldShowUpgradeButton ? "opacity-100 scale-100" : "opacity-0 scale-95 hidden"
            )}>
              {shouldShowUpgradeButton && (
                <Button 
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-sm"
                  onClick={handleUpgradeClick}
                  disabled={loading}
                >
                  Upgrade to Premium
                </Button>
              )}
            </div>

            {/* User Menu */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-8 w-8 rounded-full"
                    disabled={loading}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL} alt={user.displayName || 'User avatar'} />
                      <AvatarFallback>
                        {user.displayName?.charAt(0) || user.email?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {subscription && (
                    <>
                      <DropdownMenuItem className="cursor-pointer" asChild>
                        <Link to="/manage-subscription">
                          <div className="flex flex-col gap-2 w-full">
                            {/* Status Badge */}
                            <SubscriptionBadge status={subscriptionStatus} />
                            
                            {/* Subscription Info */}
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">
                                {subscriptionStatus.subLabel}
                              </span>
                              
                              {/* Add clear call to action */}
                              <div className="flex items-center gap-1 text-sm text-blue-600 mt-1">
                                <span>View My Account</span>
                                {subscriptionStatus.type !== 'cancelled' && (
                                  <span className="text-gray-400">•</span>
                                )}
                                {subscriptionStatus.type === 'active' && (
                                  <span className="text-gray-600 text-xs">
                                    Manage or cancel subscription
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing out...
                      </div>
                    ) : (
                      'Sign out'
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation - UPDATED PATHS */}
      <div className="md:hidden border-t">
        <nav className="flex justify-between px-4 py-2">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/vehicle-calculator">Vehicle</NavLink>
          <NavLink to="/house-calculator">House</NavLink>
          <NavLink to="/pricing">Pricing</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
      </div>

      {/* Dialogs */}
      <PremiumDialog 
        isOpen={showPremiumDialog}
        isRegistering={isRegistering}
        onClose={handleDialogClose}
        onSuccess={handleAuthSuccess}
      />

      <PremiumFeatureDialog  // Changed from PremiumUpgradeDialog to PremiumFeatureDialog
        isOpen={showUpgradeDialog}
        onClose={() => setShowUpgradeDialog(false)}
        onSuccess={handleUpgradeSuccess}
      />
    </header>
  );
};

export default Header;
