import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useSubscription } from './contexts/SubscriptionContext';

const Footer = () => {
  const { user } = useAuth();
  const { subscription, isSubscribed, isTrialing } = useSubscription();

  return (
    <footer className="bg-gray-50 py-8 mt-12 border-t">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo and Tagline */}
          <div className="text-center md:text-left">
            <Link 
              to="/" 
              className="font-bold text-lg hover:text-gray-900 transition-colors"
            >
              Nickle
            </Link>
            <p className="text-sm text-gray-600">Smart financial planning for everyone</p>
          </div>

          {/* Navigation and Copyright */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <nav className="flex gap-6">
              {/* Basic Navigation Links */}
              <Link 
                to="/about" 
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                About
              </Link>

              <Link 
                to={user && (isSubscribed || isTrialing) ? "/manage-subscription" : "/pricing"}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {user && (isSubscribed || isTrialing) ? 'Manage Subscription' : 'Pricing'}
              </Link>

              <Link 
                to="/contact" 
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Contact
              </Link>

              <Link 
                to="/privacy" 
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Privacy
              </Link>

              <Link 
                to="/terms" 
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Terms
              </Link>
            </nav>

            {/* Copyright */}
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Nickle. All rights reserved.
            </p>
          </div>
        </div>

        {/* Mobile View - Additional Info */}
        <div className="mt-6 text-center md:hidden">
          <div className="space-y-2">
            {user && subscription && (
              <p className="text-sm text-gray-600">
                {isTrialing 
                  ? `Trial ends ${new Date(subscription.trialEndDate).toLocaleDateString()}`
                  : isSubscribed 
                    ? 'Premium Account Active'
                    : 'Free Account'
                }
              </p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;