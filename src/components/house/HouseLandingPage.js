import React from 'react';
import HouseCostCalculator from './HouseCostCalculator';
import Meta from '../SEO/Meta';
import { Home, Shield, Clock, TrendingUp } from 'lucide-react';

const HouseLandingPage = () => {
  return (
    <>
      <Meta
        title="Home Affordability Calculator South Africa | Nickle"
        description="Free home affordability calculator for South Africa. Find out how much you can afford to spend on a house, including bond repayments, transfer duties, and monthly expenses."
        keywords="home affordability calculator, house budget calculator, bond calculator, how much house can I afford, South Africa, property costs"
      />

      <div className="bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white">
          <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 text-center">
            <div className="mb-6">
              <Home className="h-16 w-16 mx-auto text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How Much House Can You <span className="text-green-600">Actually</span> Afford?
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Our free home affordability calculator gives you a realistic budget for your property search. 
              We break down all the costs, from bond repayments to transfer duties, so you can buy your dream home with confidence.
            </p>
          </div>
        </div>

        {/* Calculator Section */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200">
            <HouseCostCalculator />
          </div>
        </div>

        {/* Why Use This Calculator Section */}
        <div className="bg-white">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Plan Your Home Purchase with Confidence
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={Shield}
                title="Uncover All Costs"
                description="Our calculator includes transfer duties, bond registration, and other upfront costs that are often overlooked."
                color="text-blue-600"
              />
              <FeatureCard
                icon={Clock}
                title="Instant, Clear Results"
                description="Get a detailed breakdown of your home budget in minutes. No sign-ups or waiting required."
                color="text-green-600"
              />
              <FeatureCard
                icon={TrendingUp}
                title="Empower Your Negotiation"
                description="Walk into viewings with a clear understanding of your budget, putting you in a stronger position."
                color="text-purple-600"
              />
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <FAQItem
              question="How do you calculate the affordable house price?"
              answer="We start with your monthly salary and a recommended housing budget (which you can change) to figure out a safe monthly amount for all housing costs. From there, we factor in your loan details, down payment, and estimated monthly expenses (like rates and insurance) to work backward and estimate the maximum house price you can afford."
            />
            <FAQItem
              question="What percentage of my income should go to housing?"
              answer="Most financial advisors suggest that your total housing costs (bond repayment, rates, insurance, etc.) should not exceed 25-30% of your gross monthly income. Our calculator uses this as a guideline, but you can adjust the percentage to fit your personal financial situation."
            />
            <FAQItem
              question="What are transfer duties and how are they calculated?"
              answer="Transfer duty is a tax levied by the government on the transfer of property. The amount is calculated on a sliding scale based on the property's value. Our calculator automatically calculates the estimated transfer duty for you, so you don't have to worry about the complex calculations."
            />
            <FAQItem
              question="Is this calculator 100% free?"
              answer="Absolutely. Our home affordability calculator is completely free to use. We believe everyone deserves access to quality financial tools. The core calculators on Nickle will always be free, though we may add optional premium features in the future."
            />
          </div>
        </div>
      </div>
    </>
  );
};

const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <div className="text-center space-y-4">
    <div className="flex justify-center">
      <div className="p-4 bg-gray-100 rounded-full">
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
    </div>
    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left font-semibold text-lg text-gray-800"
      >
        <span>{question}</span>
        <span>{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && (
        <div className="mt-4 text-gray-600">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default HouseLandingPage;

