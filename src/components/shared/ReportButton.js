import React from 'react';
import { Button } from "../ui/button";
import { Loader2, FileText, Lock, Download } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "../ui/tooltip";

const ReportButton = ({ 
  onClick, 
  user, 
  subscription, 
  isLoading,
  type = 'house',
  disabled = false
}) => {
  const hasPremiumAccess = user && 
    subscription?.status && 
    ['active', 'trialing'].includes(subscription.status);

  const tooltipContent = !user 
    ? 'Sign up for premium to generate detailed reports'
    : !hasPremiumAccess 
    ? 'Upgrade to premium to generate detailed reports'
    : disabled
    ? 'Complete your calculation to generate a report'
    : `Generate a detailed ${type} report with cost analysis`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full">
            <Button 
              onClick={onClick} 
              variant={hasPremiumAccess ? "outline" : "secondary"}
              className="w-full relative group"
              disabled={isLoading || disabled || !hasPremiumAccess}
            >
              <span className="flex items-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating {type} report...</span>
                  </>
                ) : hasPremiumAccess ? (
                  <>
                    <FileText className="h-4 w-4" />
                    <span>Generate {type} report</span>
                    <Download className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4" />
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Upgrade to generate reports</span>
                  </>
                )}
              </span>
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
          {hasPremiumAccess && !disabled && (
            <p className="text-xs text-muted-foreground mt-1">
              Get a comprehensive PDF report with detailed analysis
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ReportButton;