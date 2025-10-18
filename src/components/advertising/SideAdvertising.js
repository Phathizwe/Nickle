// src/components/advertising/SideAdvertising.js
import React from 'react';
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Link, useNavigate } from 'react-router-dom';
import { cn } from "../../lib/utils";
import { 
  ArrowUpRight, 
  Car, 
  Home, 
  Calendar,
  Clock,
  Share2,
  Mail,
  Share
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';

// Financial Tips Data (if you don't have the constants file yet)
const financialTipsData = [
  {
    slug: '50-30-20-rule',
    title: '50/30/20 Budget Rule: Your Path to Financial Balance',
    description: 'Learn how to effectively allocate your income using the 50/30/20 budgeting rule.',
    date: '2024-03-10',
    readTime: 5,
    icon: ArrowUpRight
  },
  {
    slug: 'emergency-fund',
    title: 'Building Your Emergency Fund: A Complete Guide',
    description: 'Essential steps to create and maintain your financial safety net.',
    date: '2024-03-03',
    readTime: 4,
    icon: ArrowUpRight
  },
  {
    slug: 'smart-investment',
    title: 'Smart Investment Strategies for Beginners',
    description: 'Start your investment journey with these proven strategies.',
    date: '2024-02-25',
    readTime: 6,
    icon: ArrowUpRight
  }
];

const AdCard = ({ title, description, icon: Icon, linkText, linkUrl, variant = "default" }) => (
  <Card className={`p-4 mb-4 ${
    variant === "highlight" ? 'bg-yellow-100 border-yellow-300' : 'bg-white'
  }`}>
    <div className="flex flex-col space-y-3">
      <div className="flex items-start space-x-3">
        {Icon && (
          <div className="mt-1">
            <Icon className="h-5 w-5 text-blue-500" />
          </div>
        )}
        <div>
          <h3 className="font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      {linkText && (
        <Link to={linkUrl}>
          <Button
            variant="outline"
            className="w-full text-center bg-black text-white hover:bg-gray-800"
          >
            {linkText}
          </Button>
        </Link>
      )}
    </div>
  </Card>
);

const ShareCard = () => {
  const shareUrl = window.location.origin;
  const shareMessage = "Check out Nickle - a smart way to plan your budget and major purchases: ";
  
  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: Share2,
      url: `https://wa.me/?text=${encodeURIComponent(shareMessage + shareUrl)}`,
      color: 'text-green-500',
      hoverColor: 'hover:bg-green-50'
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=Check out Nickle&body=${encodeURIComponent(shareMessage + shareUrl)}`,
      color: 'text-blue-500',
      hoverColor: 'hover:bg-blue-50'
    }
  ];

  return (
    <Card className="p-4 mb-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="flex flex-col space-y-3">
        <div className="flex items-start space-x-3">
          <div className="mt-1">
            <Share className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Share Nickle</h3>
            <p className="text-sm text-gray-600 mb-3">
              Help your friends make better financial decisions
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {shareLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 p-2 rounded-lg",
                  "border border-gray-200 transition-colors duration-200",
                  link.hoverColor
                )}
              >
                <Icon className={cn("h-4 w-4", link.color)} />
                <span className="text-sm font-medium">{link.name}</span>
              </a>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

const FinancialTipCard = ({ tip }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      onClick={() => navigate(`/financial-tips/${tip.slug}`)}
      className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start space-x-2">
        <tip.icon className="h-5 w-5 text-green-500 mt-1" />
        <div>
          <h4 className="font-medium text-sm">{tip.title}</h4>
          <p className="text-xs text-gray-600 line-clamp-2 mb-2">{tip.description}</p>
          <div className="flex items-center text-xs text-gray-400">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date(tip.date).toLocaleDateString('en-ZA', {
              month: 'short',
              day: 'numeric'
            })}
            <span className="mx-2">•</span>
            <Clock className="h-3 w-3 mr-1" />
            {tip.readTime} min read
          </div>
        </div>
      </div>
    </div>
  );
};

const SideAdvertising = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Add error handling for subscription context
  let subscription = { status: null };
  try {
    // Use optional chaining to safely access the subscription context
    const { subscription: sub } = useSubscription?.() || {};
    if (sub) {
      subscription = sub;
    }
  } catch (error) {
    console.log("Subscription context not available:", error);
  }
  
  const latestTips = financialTipsData.slice(0, 3);

  // Check if user should see premium promotion
  const isSubscribed = subscription?.status === 'active' || subscription?.status === 'trialing';
  const shouldShowPremiumPromo = !user || !isSubscribed;

  return (
    <div className="w-64 space-y-6 pl-4">
      {shouldShowPremiumPromo && (
        <AdCard
          title="Unlock Premium Features"
          description="Save calculations, access advanced templates, and get detailed reports."
          icon={ArrowUpRight}
          linkText="Upgrade Now"
          linkUrl="/pricing"
          variant="highlight"
        />
      )}

      {/* Share Card */}
      <ShareCard />

      {/* Calculator Promotions */}
      <div className={!shouldShowPremiumPromo ? "" : "border-t pt-4"}>
        <h3 className="text-sm font-semibold text-gray-500 mb-4">Financial Tools</h3>
        <AdCard
          title="Vehicle Cost Calculator"
          description="Plan your car purchase with our comprehensive calculator."
          icon={Car}
          linkText="Calculate Now"
          linkUrl="/vehicle-cost-calculator"
        />
        
        <AdCard
          title="House Cost Calculator"
          description="Estimate your home buying costs and affordability."
          icon={Home}
          linkText="Calculate Now"
          linkUrl="/house-cost-calculator"
        />
      </div>

      {/* Latest Financial Tips Section */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-500">Financial Tips</h3>
          <Button 
            variant="ghost" 
            className="text-xs text-blue-500 hover:text-blue-600 p-0 h-auto"
            onClick={() => navigate('/financial-tips')}
          >
            View All →
          </Button>
        </div>
        <div className="space-y-3">
          {latestTips.map((tip) => (
            <FinancialTipCard key={tip.slug} tip={tip} />
          ))}
        </div>
      </div>

      {/* Get Help Section */}
      <div className="border-t pt-4">
        <Card className="bg-blue-50 p-4">
          <h3 className="font-semibold mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-3">
            Our team is here to assist you with your financial planning
          </p>
          <Link to="/contact">
            <Button variant="outline" className="w-full">
              Contact Support
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default SideAdvertising;