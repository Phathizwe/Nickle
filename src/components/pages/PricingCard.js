import React from 'react';
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Check } from "lucide-react";

const PricingCard = ({
  title,
  price,
  billingPeriod,
  features,
  buttonText,
  onAction,
  loading,
  highlight = false,
  showAnnualSaving = false,
}) => {
  return (
    <Card className={`relative ${highlight ? 'border-2 border-blue-500 shadow-lg' : ''}`}>
      {highlight && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold text-gray-900">R{price}</span>
            <span className="text-gray-500">/{billingPeriod}</span>
          </div>
          {showAnnualSaving && (
            <p className="text-sm text-green-600 font-semibold">
              Save 33% vs monthly
            </p>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Action Button */}
        <Button
          onClick={onAction}
          disabled={loading || buttonText === "Current Plan"}
          className={`w-full ${
            highlight
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-800 hover:bg-gray-900'
          } text-white`}
          variant={highlight ? "default" : "outline"}
        >
          {loading ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Loading...
            </>
          ) : (
            buttonText
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PricingCard;

