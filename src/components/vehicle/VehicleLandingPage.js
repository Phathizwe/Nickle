import React from 'react';
import VehicleCostCalculator from './VehicleCostCalculator';
import Meta from '../SEO/Meta';
import { Car, Shield, Clock, TrendingUp } from 'lucide-react';

const VehicleLandingPage = () => {
  return (
    <>
      <Meta
        title="Car Affordability Calculator South Africa | Nickle"
        description="Free car affordability calculator for South Africa. Find out how much you can afford to spend on a car, including monthly repayments, insurance, and fuel costs."
        keywords="car affordability calculator, car budget calculator, vehicle finance calculator, how much car can I afford, South Africa, car costs"
      />

      <div className="bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white">
          <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 text-center">
            <div className="mb-6">
              <Car className="h-16 w-16 mx-auto text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How Much Car Can You <span className="text-blue-600">Realistically</span> Afford?
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Our free car affordability calculator helps you find a budget that works for your lifestyle. 
              Get a detailed breakdown of all costs, including hidden fees, so you can buy with confidence.
            </p>
          </div>
        </div>

        {/* Calculator Section */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200">
            <VehicleCostCalculator />
          </div>
        </div>

        {/* Why Use This Calculator Section */}
        <div className="bg-white">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Plan Your Car Purchase the Smart Way
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={Shield}
                title="Avoid Hidden Costs"
                description="Our calculator includes often-forgotten expenses like insurance, maintenance, and registration fees."
                color="text-blue-600"
              />
              <FeatureCard
                icon={Clock}
                title="Instant, Accurate Results"
                description="Get a clear picture of your car budget in minutes. No waiting, no sign-ups required."
                color="text-green-600"
              />
              <FeatureCard
                icon={TrendingUp}
                title="Make Confident Decisions"
                description="Know exactly what you can afford, giving you the upper hand in negotiations."
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
              question="How is the affordable car price calculated?"
              answer="We take your monthly salary and a recommended budget percentage (which you can adjust) to determine a safe monthly amount for all car-related expenses. We then work backward, considering your loan terms, interest rates, and running costs, to estimate the maximum car price you can comfortably afford."
            />
            <FAQItem
              question="What percentage of my salary should I spend on a car?"
              answer="Financial experts generally recommend spending between 10% to 15% of your take-home pay on all car-related costs, including the monthly payment, insurance, fuel, and maintenance. Our calculator defaults to a flexible 30% budget for all vehicle expenses, which you can adjust based on your priorities."
            />
            <FAQItem
              question="Does this calculator account for interest rate changes?"
              answer="Yes, you can input different interest rates to see how they affect your monthly payments and overall affordability. We recommend testing a few different rates to understand the potential impact of interest rate fluctuations."
            />
            <FAQItem
              question="Is this calculator free to use?"
              answer="Yes, our car affordability calculator is 100% free. Our goal is to empower you with the information you need to make smart financial decisions. We may introduce premium features later, but the core calculators will always be free."
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

export default VehicleLandingPage;

