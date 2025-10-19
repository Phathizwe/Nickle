import React from 'react';
import Meta from '../SEO/Meta';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "How Much Should You Spend on a Car? A South African Guide",
      excerpt: "Learn the 20/4/10 rule and discover how much you can realistically afford to spend on a vehicle based on your income.",
      date: "2025-10-15",
      readTime: "5 min read",
      category: "Car Buying",
      slug: "how-much-should-you-spend-on-a-car"
    },
    {
      id: 2,
      title: "Understanding Transfer Duty in South Africa",
      excerpt: "A complete breakdown of transfer duty costs when buying property, including the latest rates and exemptions.",
      date: "2025-10-10",
      readTime: "7 min read",
      category: "Home Buying",
      slug: "understanding-transfer-duty-south-africa"
    },
    {
      id: 3,
      title: "Hidden Costs of Car Ownership You Need to Know",
      excerpt: "Beyond the monthly payment: insurance, fuel, maintenance, and other expenses that add up quickly.",
      date: "2025-10-05",
      readTime: "6 min read",
      category: "Car Buying",
      slug: "hidden-costs-car-ownership"
    },
    {
      id: 4,
      title: "First-Time Home Buyer's Guide for South Africa",
      excerpt: "Everything you need to know before buying your first property, from bond applications to closing costs.",
      date: "2025-09-28",
      readTime: "10 min read",
      category: "Home Buying",
      slug: "first-time-home-buyer-guide-south-africa"
    },
    {
      id: 5,
      title: "How to Negotiate a Better Car Price",
      excerpt: "Proven strategies to get the best deal when buying a new or used car in South Africa.",
      date: "2025-09-20",
      readTime: "8 min read",
      category: "Car Buying",
      slug: "how-to-negotiate-better-car-price"
    },
    {
      id: 6,
      title: "The 30% Rule: How Much Should You Spend on Housing?",
      excerpt: "Is the 30% rule still relevant? We break down how much of your income should go to housing costs.",
      date: "2025-09-15",
      readTime: "5 min read",
      category: "Home Buying",
      slug: "30-percent-rule-housing-costs"
    }
  ];

  return (
    <>
      <Meta
        title="Financial Planning Blog | Nickle"
        description="Expert advice on car buying, home buying, and financial planning in South Africa. Free guides and resources to help you make smarter financial decisions."
        keywords="financial planning blog, car buying tips, home buying guide, South Africa, budget advice"
      />

      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-white">
          <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Financial Planning <span className="text-blue-600">Resources</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Expert advice and practical guides to help you make smarter financial decisions 
              about cars, homes, and budgeting.
            </p>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-blue-50 rounded-2xl p-8 md:p-12 text-center border border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              More Articles Coming Soon
            </h2>
            <p className="text-gray-700 mb-6">
              We're constantly adding new content to help you make better financial decisions. 
              Check back regularly for new guides and tips.
            </p>
            <p className="text-sm text-gray-600">
              Have a topic you'd like us to cover? <a href="/contact" className="text-blue-600 hover:underline">Let us know!</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

const BlogPostCard = ({ post }) => (
  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden group">
    <div className="p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          {post.category}
        </span>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
        {post.title}
      </h3>
      
      <p className="text-gray-600 mb-4 line-clamp-3">
        {post.excerpt}
      </p>
      
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(post.date).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>
      
      <button className="flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all">
        Read More
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  </div>
);

export default Blog;

