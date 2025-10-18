// src/components/layouts/MainLayout.js (updated)
import React from 'react';
import SideAdvertising from '../advertising/SideAdvertising';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const MainLayout = ({ children, showAds = true }) => {
  const location = useLocation();
  const { user } = useAuth();

  // Only show the need help box on these paths and when NOT signed in
  // This prevents the conflict with other help components for authenticated users
  const showNeedHelp = ['/pricing', '/contact'].includes(location.pathname) && !user;

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-4 md:space-y-8">
            {children}
          </div>

          {/* Side Advertising - Only show on wider screens and when ads are enabled */}
          {showAds && (
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-6">
                <SideAdvertising />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Show Need Help box only on specific routes and when not signed in */}
      {showNeedHelp && (
        <div className="fixed bottom-4 right-4 z-50 bg-white p-4 rounded-lg shadow-lg">
          <div className="flex flex-col space-y-2">
            <h3 className="font-semibold">Need Help?</h3>
            <p className="text-sm text-gray-600">
              Our team is here to assist you
            </p>
            <a
              href="mailto:support@nickle.com"
              className="text-sm text-blue-600 hover:underline"
            >
              Contact Support →
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;