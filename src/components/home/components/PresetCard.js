// src/components/home/components/PresetCard.js
import React from 'react';
import { Shield, BarChart3, TrendingUp } from 'lucide-react';

export const PresetCard = ({ title, description, icon: Icon, isSelected, onClick, percentage }) => (
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
        <div className={`
          text-sm font-semibold
          ${isSelected ? 'text-blue-600' : 'text-gray-600'}
        `}>
          R{percentage}
        </div>
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