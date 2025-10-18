// src/components/pages/Terms.js
import React from 'react';
import { Card } from "../../components/ui/card";
import Meta from '../SEO/Meta';

export default function Terms() {
  // Add debugging log
  console.log('Rendering page: Terms');
  
  return (
    <>
      <Meta
        title="Terms of Service | Nickle"
        description="Read about Nickle's terms of service and user agreement."
        keywords="terms of service, user agreement, conditions, Nickle"
      />
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
            <p className="text-gray-600">Last updated: March 17, 2024</p>
          </div>

          <Card className="p-6 space-y-6">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">1. Agreement to Terms</h2>
              <p className="text-gray-600">
                By accessing and using Nickle's services, you agree to be bound by these Terms of
                Service and our Privacy Policy. If you disagree with any part of these terms,
                you may not access our services.
              </p>
            </section>

            {/* Other sections remain the same */}
            {/* ... */}

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">12. Contact Information</h2>
              <p className="text-gray-600">
                Questions about these Terms of Service should be sent to us at{' '}
                <a href="mailto:legal@nickle.co.za" className="text-blue-600 hover:underline">
                  legal@nickle.co.za
                </a>
              </p>
            </section>

            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">
                By using Nickle's services, you acknowledge that you have read and understood
                these Terms of Service and agree to be bound by them.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}