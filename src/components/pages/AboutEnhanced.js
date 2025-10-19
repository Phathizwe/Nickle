import React from 'react';
import Meta from '../SEO/Meta';
import { Target, Heart, Users, TrendingUp } from 'lucide-react';

const AboutEnhanced = () => {
  return (
    <>
      <Meta
        title="About Nickle | Smart Budgets Meet Smart Ambitions"
        description="Learn about Nickle's mission to help South Africans make smarter financial decisions through free, easy-to-use budget calculators."
        keywords="about nickle, financial planning, budget tools, South Africa"
      />

      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-white">
          <div className="max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Smart Budgets Meet <span className="text-blue-600">Smart Ambitions</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're on a mission to empower South Africans to make confident financial decisions 
              about their biggest purchases.
            </p>
          </div>
        </div>

        {/* Our Story */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
              <p>
                Nickle was born from a simple observation: too many people make major financial 
                commitments without fully understanding what they can truly afford. We've seen 
                friends, family, and colleagues struggle with car payments or bond repayments that 
                stretch their budgets to the breaking point.
              </p>
              <p>
                We believe that everyone deserves access to clear, honest financial tools that help 
                them make informed decisions. That's why we created Nickle—a set of free, 
                easy-to-use calculators that give you a realistic picture of what you can afford 
                before you commit.
              </p>
              <p>
                Our calculators don't just show you a number. They break down all the costs—the 
                ones you expect and the ones you might forget—so you can plan with confidence and 
                avoid financial stress down the road.
              </p>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ValueCard
              icon={Target}
              title="Clarity Over Complexity"
              description="We cut through financial jargon to give you clear, actionable insights. No confusing terms, no hidden agendas—just straightforward information you can use."
              color="text-blue-600"
            />
            <ValueCard
              icon={Heart}
              title="Free for Everyone"
              description="We believe financial empowerment shouldn't come with a price tag. Our core calculators will always be free, because everyone deserves access to quality financial tools."
              color="text-red-600"
            />
            <ValueCard
              icon={Users}
              title="Built for South Africans"
              description="Our calculators are designed specifically for the South African market, taking into account local costs, regulations, and financial realities."
              color="text-green-600"
            />
            <ValueCard
              icon={TrendingUp}
              title="Empowerment Through Knowledge"
              description="We don't just give you numbers—we help you understand what they mean. Our goal is to empower you to make confident, informed financial decisions."
              color="text-purple-600"
            />
          </div>
        </div>

        {/* Our Commitment */}
        <div className="bg-white">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Our Commitment to You
              </h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Nickle's car and house calculators will always be free. As we grow, we may introduce 
                optional premium features like advanced budgeting tools, but the core calculators you 
                rely on today will remain accessible to everyone, forever.
              </p>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                We're constantly working to improve our tools and add new features that help you take 
                control of your financial future. Your feedback shapes our roadmap, so don't hesitate 
                to let us know how we can serve you better.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Plan Your Next Big Purchase?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Use our free calculators to find out what you can afford.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/vehicle-calculator"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Car Calculator
              </a>
              <a
                href="/house-calculator"
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                House Calculator
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ValueCard = ({ icon: Icon, title, description, color }) => (
  <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200 hover:shadow-lg transition-shadow">
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0">
        <div className="p-3 bg-gray-50 rounded-lg">
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

export default AboutEnhanced;

