import React from 'react';
import { Button } from "../../ui/button";
import { Loader2 } from "lucide-react";

const CalculateButton = ({ onClick, loading = false, disabled = false }) => {
  return (
    <Button 
      onClick={onClick} 
      className="w-full"
      size="lg"
      disabled={loading || disabled}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Calculating...
        </>
      ) : (
        'Calculate Affordable House Price'
      )}
    </Button>
  );
};

export default CalculateButton;