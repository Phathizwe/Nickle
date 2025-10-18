import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { 
  Calendar,
  Clock,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  PiggyBank,
  TrendingUp,
  ShieldCheck,
  Target,
  Wallet,
  DollarSign,
  LineChart,
  BadgeDollarSign
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

// Financial tips data
export const financialTipsData = [
  {
    icon: PiggyBank,
    title: "50/30/20 Budget Rule: Your Path to Financial Balance",
    date: "2024-11-10",
    readTime: 5,
    description: "Learn how to effectively allocate your income using the 50/30/20 rule.",
    slug: "50-30-20-budget-rule",
    category: "Budgeting",
    author: "Financial Team",
    content: (
      <>
        <p className="mb-4">
          The 50/30/20 rule is a simple yet powerful budgeting approach that helps you allocate your after-tax income:
        </p>
        <h3 className="text-lg font-semibold mb-3">Breaking Down the Rule</h3>
        <ul className="list-disc pl-5 mb-4">
          <li className="mb-2">50% for essential needs (housing, utilities, groceries)</li>
          <li className="mb-2">30% for wants (entertainment, dining out, hobbies)</li>
          <li className="mb-2">20% for savings and debt repayment</li>
        </ul>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="font-medium mb-2">Want to dive deeper into the 50/30/20 rule?</p>
          <p className="text-gray-600 mb-3">
            We've prepared a comprehensive guide that includes practical examples, worksheets, and step-by-step implementation strategies.
          </p>
          <a 
            href="http://tiny.cc/fzkuzz" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            Read the full guide here →
          </a>
        </div>
      </>
    )
  },
  {
    icon: ShieldCheck,
    title: "Building Your Emergency Fund: A Complete Guide",
    date: "2024-03-03",
    readTime: 4,
    description: "Essential steps to create and maintain your financial safety net.",
    slug: "emergency-fund-basics",
    category: "Savings",
    author: "Financial Team",
    content: (
      <>
        <p className="mb-4">
          An emergency fund is your financial safety net for unexpected expenses and life events. Having this buffer can prevent debt and provide peace of mind during challenging times.
        </p>
        <h3 className="text-lg font-semibold mb-3">Key Components</h3>
        <ul className="list-disc pl-5 mb-4">
          <li className="mb-2">Aim for 3-6 months of living expenses</li>
          <li className="mb-2">Keep it in an easily accessible account</li>
          <li className="mb-2">Maintain separation from regular spending accounts</li>
          <li className="mb-2">Consider high-yield savings accounts for better returns</li>
        </ul>
        <div className="bg-yellow-50 p-4 rounded-lg mb-4">
          <p className="font-semibold mb-2">Important:</p>
          <p>Start small if needed - even R500 per month adds up to a meaningful emergency fund over time.</p>
        </div>
      </>
    )
  },
  {
    icon: LineChart,
    title: "Investment Fundamentals for Beginners",
    date: "2024-02-25",
    readTime: 6,
    description: "Start your investment journey with these proven strategies.",
    slug: "investment-basics",
    category: "Investing",
    author: "Financial Team",
    content: (
      <>
        <p className="mb-4">
          Getting started with investing doesn't have to be complicated. Understanding these fundamentals will help you build a solid investment foundation.
        </p>
        <h3 className="text-lg font-semibold mb-3">Core Principles</h3>
        <ul className="list-disc pl-5 mb-4">
          <li className="mb-2">Start early to benefit from compound interest</li>
          <li className="mb-2">Diversify across different asset classes</li>
          <li className="mb-2">Consider low-cost index funds for beginners</li>
          <li className="mb-2">Invest regularly through rand-cost averaging</li>
        </ul>
        <div className="bg-green-50 p-4 rounded-lg mb-4">
          <p className="font-semibold mb-2">Remember:</p>
          <p>Time in the market beats timing the market. Start with what you can afford and increase contributions as your income grows.</p>
        </div>
      </>
    )
  }
];

// Format date helper
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Article preview card component
const ArticlePreview = ({ article, onClick }) => (
  <Card 
    className="mb-6 hover:shadow-lg transition-shadow cursor-pointer"
    onClick={onClick}
  >
    <div className="p-6">
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
        <span className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          {formatDate(article.date)}
        </span>
        <span>•</span>
        <span className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {article.readTime} min read
        </span>
        <span>•</span>
        <span>{article.category}</span>
      </div>
      
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <article.icon className="h-8 w-8 text-blue-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">{article.title}</h2>
          <p className="text-gray-600 mb-4">{article.description}</p>
          <div className="flex items-center text-blue-500 hover:text-blue-600">
            <span>Read more</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </div>
      </div>
    </div>
  </Card>
);

// Full article component
const FullArticle = ({ article, onBack }) => (
  <Card className="mb-6">
    <div className="p-6">
      <Button 
        variant="outline" 
        className="mb-4"
        onClick={onBack}
      >
        ← Back to Articles
      </Button>
      
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
        <span className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          {formatDate(article.date)}
        </span>
        <span>•</span>
        <span className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {article.readTime} min read
        </span>
        <span>•</span>
        <span>{article.category}</span>
      </div>

      <div className="flex items-start space-x-4 mb-6">
        <div className="flex-shrink-0">
          <article.icon className="h-12 w-12 text-blue-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900">{article.title}</h1>
          <p className="text-gray-600">{article.description}</p>
        </div>
      </div>

      <div className="prose max-w-none">
        {article.content}
      </div>
    </div>
  </Card>
);

// Main FinancialTips component
const FinancialTips = () => {
  const [selectedTip, setSelectedTip] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for selected tip in location state
    if (location.state?.selectedTip) {
      const tip = financialTipsData.find(t => t.slug === location.state.selectedTip);
      if (tip) {
        setSelectedTip(tip);
      }
      // Clear the location state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleArticleClick = (article) => {
    setSelectedTip(article);
    navigate(`/financial-tips/${article.slug}`, { replace: true });
  };

  const handleBack = () => {
    setSelectedTip(null);
    navigate('/financial-tips', { replace: true });
  };

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 3, financialTipsData.length));
  };

  const showLess = () => {
    setVisibleCount(3);
  };

  return (
    <>
      <Helmet>
        <title>{selectedTip ? `${selectedTip.title} | Nickle Financial Tips` : 'Financial Tips & Insights | Nickle'}</title>
        <meta name="description" content={selectedTip ? selectedTip.description : 'Discover practical financial tips and insights to help you make better money decisions.'} />
      </Helmet>

      <div className="max-w-4xl mx-auto py-8 px-4">
        {selectedTip ? (
          <FullArticle article={selectedTip} onBack={handleBack} />
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Tips & Insights</h1>
              <p className="text-gray-600">Discover practical advice to help you make better financial decisions.</p>
            </div>

            <div className="space-y-6">
              {financialTipsData.slice(0, visibleCount).map((article, index) => (
                <ArticlePreview 
                  key={article.slug} 
                  article={article}
                  onClick={() => handleArticleClick(article)}
                />
              ))}
            </div>

            {financialTipsData.length > 3 && (
              <div className="mt-8 text-center">
                {visibleCount < financialTipsData.length ? (
                  <Button
                    variant="outline"
                    onClick={loadMore}
                    className="inline-flex items-center space-x-2"
                  >
                    <span>Load More</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={showLess}
                    className="inline-flex items-center space-x-2"
                  >
                    <span>Show Less</span>
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default FinancialTips;