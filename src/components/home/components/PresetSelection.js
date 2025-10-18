// src/components/home/components/PresetSelection.js
import React from 'react';
import {
  Card,
  CardContent,
} from "../../ui/card";
import { Shield, BarChart3, TrendingUp } from 'lucide-react';

const PresetCard = ({ title, description, icon: Icon, isSelected, onClick, amount }) => (
  <div
    onClick={onClick}
    className={`
      relative cursor-pointer rounded-lg p-4
      transition-all duration-200 ease-in-out
      ${isSelected ? 
        'bg-blue-50 border-2 border-blue-500 shadow-sm' : 
        'bg-white border-2 border-gray-200 hover:border-blue-200'}
    `}
  >
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`
            p-2 rounded-full
            ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}
          `}>
            <Icon className="h-4 w-4" />
          </div>
          <h3 className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
            {title}
          </h3>
        </div>
        {amount && (
          <div className={`
            text-sm font-semibold
            ${isSelected ? 'text-blue-600' : 'text-gray-600'}
          `}>
            {amount}
          </div>
        )}
      </div>
      <p className={`text-sm ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
        {description}
      </p>
    </div>

    {/* Selection indicator */}
    <div className={`
      absolute -top-2 -right-2 h-6 w-6 rounded-full border-2 border-white
      transition-all duration-200
      ${isSelected ? 'bg-blue-500' : 'bg-gray-200'}
      ${isSelected ? 'opacity-100' : 'opacity-0'}
    `}>
      <svg 
        className="h-full w-full text-white" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M5 13l4 4L19 7" 
        />
      </svg>
    </div>
  </div>
);

const PRESET_INFO = {
  conservative: {
    title: "Conservative",
    description: "Focus on savings and essential expenses with lower risk allocation",
    icon: Shield
  },
  balanced: {
    title: "Balanced",
    description: "Even distribution across essential needs and savings",
    icon: BarChart3
  },
  aggressive: {
    title: "Aggressive",
    description: "Higher allocation for investments and major assets",
    icon: TrendingUp
  }
};

export const PresetSelection = ({ 
  selectedPreset, 
  onPresetSelect, 
  netSalary,
  formatCurrency
}) => (
  <Card className="mb-4 md:mb-8">
    <CardContent className="pt-6">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Choose Your Budget Strategy</h3>
          <p className="text-sm text-gray-600 mt-1">
            Select a preset that matches your financial goals
          </p>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-3">
          {Object.entries(PRESET_INFO).map(([name, info]) => {
            // Calculate the main expense amount for this preset
            let mainExpensePercentage;
            switch (name) {
              case 'conservative':
                mainExpensePercentage = 25; // Housing
                break;
              case 'balanced':
                mainExpensePercentage = 30; // Housing
                break;
              case 'aggressive':
                mainExpensePercentage = 35; // Housing
                break;
              default:
                mainExpensePercentage = 30;
            }
            
            const amount = netSalary ? 
              formatCurrency(netSalary * (mainExpensePercentage / 100)) : 
              null;

            return (
              <PresetCard
                key={name}
                title={info.title}
                description={info.description}
                icon={info.icon}
                amount={amount}
                isSelected={selectedPreset === name}
                onClick={() => onPresetSelect(name)}
              />
            );
          })}
        </div>
      </div>
    </CardContent>
  </Card>
);