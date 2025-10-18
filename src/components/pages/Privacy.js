// src/components/pages/Privacy.js
import React from 'react';
import { Card } from "../../components/ui/card";
import Meta from '../SEO/Meta';

export default function Privacy() {
  // Add debugging log
  console.log('Rendering page: Privacy');
  
  return (
    <>
      <Meta
        title="Privacy Policy | Nickle"
        description="Learn about how Nickle protects and handles your personal information."
        keywords="privacy policy, data protection, personal information, Nickle"
      />
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="text-gray-600">Last updated: March 17, 2024</p>
          </div>

          <Card className="p-6 space-y-6">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Introduction</h2>
              <p className="text-gray-600">
                At Nickle, we take your privacy seriously. This Privacy Policy explains how we collect,
                use, disclose, and safeguard your information when you use our website and services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Information We Collect</h2>
              <div className="space-y-2">
                <h3 className="font-semibold">Personal Information</h3>
                <p className="text-gray-600">
                  We may collect personal information that you voluntarily provide when using our services,
                  including:
                </p>
                <ul className="list-disc list-inside text-gray-600 ml-4">
                  <li>Name and email address</li>
                  <li>Financial information for calculations</li>
                  <li>Account credentials</li>
                  <li>Communication preferences</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
              <p className="text-gray-600">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-gray-600 ml-4">
                <li>Provide and maintain our services</li>
                <li>Improve and personalize user experience</li>
                <li>Communicate with you about our services</li>
                <li>Protect against unauthorized access</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Data Security</h2>
              <p className="text-gray-600">
                We implement appropriate technical and organizational security measures to protect
                your personal information. However, no electronic transmission over the internet
                can be completely secure, and we cannot guarantee its absolute security.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Your Rights</h2>
              <p className="text-gray-600">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-600 ml-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Contact Us</h2>
              <p className="text-gray-600">
                If you have questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:privacy@nickle.co.za" className="text-blue-600 hover:underline">
                  privacy@nickle.co.za
                </a>
              </p>
            </section>
          </Card>
        </div>
      </div>
    </>
  );
}