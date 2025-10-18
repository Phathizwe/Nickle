// src/components/advertising/FinancialTips.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
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

// Financial tips data
export const financialTipsData = [
  {
    icon: PiggyBank,
    title: "50/30/20 Budget Rule: Your Path to Financial Balance",
    date: "2024-03-10",
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
        <p>
          Start by tracking your current spending and gradually adjust your habits to align with these percentages.
        </p>
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
          An emergency fund is your financial safety net for unexpected expenses.
        </p>
        <ul className="list-disc pl-5 mb-4">
          <li className="mb-2">Aim for 3-6 months of living expenses</li>
          <li className="mb-2">Keep it in an easily accessible account</li>
          <li className="mb-2">Start small and build consistently</li>
        </ul>
        <p>
          Remember: Even saving R500 per month adds up to a meaningful emergency fund over time.
        </p>
      </>
    )
  },
  {
    icon: Target,
    title: "Smart Investment Strategies for Beginners",
    date: "2024-02-25",
    readTime: 6,
    description: "Start your investment journey with these proven strategies.",
    slug: "investment-basics",
    category: "Investing",
    author: "Financial Team",
    content: (
      <>
        <p className="mb-4">
          Getting started with investing doesn't have to be complicated.
        </p>
        <ul className="list-disc pl-5 mb-4">
          <li className="mb-2">Start early to benefit from compound interest</li>
          <li className="mb-2">Diversify your investments</li>
          <li className="mb-2">Consider low-cost index funds</li>
        </ul>
        <p>
          Time in the market beats timing the market.
        </p>
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

// Main FinancialTips component
const FinancialTips = () => {
  const [selectedTip, setSelectedTip] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams();

  useEffect(() => {
    // Check for selected tip in URL or location state
    if (slug) {
      const tip = financialTipsData.find(t => t.slug === slug);
      if (tip) {
        setSelectedTip(tip);
      }
    } else if (location.state?.selectedTip) {
      const tip = financialTipsData.find(t => t.slug === location.state.selectedTip);
      if (tip) {
        setSelectedTip(tip);
      }
      // Clear the location state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate, slug]);

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
        <title>
          {selectedTip ? `${selectedTip.title} | Nickle Financial Tips` : 'Financial Tips & Insights | Nickle'}
        </title>
        <meta 
          name="description" 
          content={selectedTip ? selectedTip.description : 'Discover practical financial tips and insights to help you make better money decisions.'} 
        />
      </Helmet>

      <div className="max-w-4xl mx-auto py-8 px-4">
        {selectedTip ? (
          <FullArticle article={selectedTip} onBack={handleBack} />
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Financial Tips & Insights
              </h1>
              <p className="text-gray-600">
                Discover practical advice to help you make better financial decisions.
              </p>
            </div>

            <div className="space-y-6">
              {financialTipsData.slice(0, visibleCount).map((article) => (
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