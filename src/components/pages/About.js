// src/components/pages/About.js
import React, { useEffect } from 'react';

const About = () => {
  // Add debugging log
  console.log('Rendering page: About');
  
  // Log when component mounts and unmounts
  useEffect(() => {
    console.log('About page mounted');
    return () => {
      console.log('About page unmounted');
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">About Nickle</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            At Nickle, we believe that financial planning should be accessible to everyone. Our mission is to help South Africans make smarter financial decisions by providing tools that start with your budget and work backwards to determine what you can actually afford.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Approach</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Unlike traditional calculators that start with a house or car price and then tell you what you'll pay, Nickle works differently. We start with your actual budget and help you understand what you can realistically afford without stretching yourself too thin.
          </p>
          <p className="text-gray-700 leading-relaxed">
            This approach helps prevent the common pitfall of falling in love with a home or vehicle first, only to later discover it doesn't fit your financial reality.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-700 leading-relaxed">
            Nickle was founded by a team of financial experts and software developers who saw a gap in the South African market. Too many people were making major financial commitments without fully understanding the long-term implications on their budget.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            We created Nickle to empower South Africans with the tools they need to make informed decisions about big purchases like homes and vehicles, ensuring they maintain financial stability while pursuing their ambitions.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-2 text-gray-900">Transparency</h3>
              <p className="text-gray-700">We believe in clear, honest financial information without hidden agendas or confusing jargon.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-2 text-gray-900">Empowerment</h3>
              <p className="text-gray-700">We give you the tools to make your own informed decisions rather than telling you what to do.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-2 text-gray-900">Accessibility</h3>
              <p className="text-gray-700">Financial planning tools should be available to everyone, not just those who can afford financial advisors.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-2 text-gray-900">Responsibility</h3>
              <p className="text-gray-700">We encourage sustainable financial decisions that support long-term financial health.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;