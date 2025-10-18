import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../ui/card";
import { Label } from "../../ui/label";
import { Slider } from "../../ui/slider";
import { Input } from "../../ui/input";
import { formatCurrency } from '../utils/formatters';

export const PurchaseDecisions = ({
  deposit,
  setDeposit,
  term,
  setTerm,
  interestRate,
  setInterestRate,
  balloonPayment,
  setBalloonPayment,
  affordableCarPrice,
}) => {
  // Helper function to validate and update numeric values
  const handleNumberInput = (value, setter, min, max, isDecimal = false) => {
    const numValue = isDecimal ? parseFloat(value) : parseInt(value);
    if (!isNaN(numValue)) {
      if (numValue >= min && numValue <= max) {
        setter(numValue);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Vehicle Purchasing Decisions</CardTitle>
        <CardDescription>
          Configure your vehicle financing options
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Deposit</Label>
          <div className="flex items-center space-x-4">
            <div className="flex-grow">
              <Slider
                value={[parseFloat(deposit) || 0]}
                onValueChange={(value) => setDeposit(value[0].toString())}
                min={0}
                max={parseFloat(affordableCarPrice) || 100000}
                step={1000}
                className="flex-grow"
              />
            </div>
            <div className="flex-shrink-0 w-32">
              <Input
                type="text"
                value={deposit}
                onChange={(e) => {
                  const cleanValue = e.target.value.replace(/[^0-9]/g, '');
                  handleNumberInput(
                    cleanValue,
                    value => setDeposit(value.toString()),
                    0,
                    parseFloat(affordableCarPrice) || 100000
                  );
                }}
                className="text-right"
              />
            </div>
          </div>
          <div className="text-sm text-muted-foreground text-right">
            {formatCurrency(deposit)}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Interest Rate</Label>
          <div className="flex items-center space-x-4">
            <div className="flex-grow">
              <Slider
                value={[interestRate]}
                onValueChange={(value) => setInterestRate(value[0])}
                min={0}
                max={20}
                step={0.1}
              />
            </div>
            <div className="flex-shrink-0 w-24">
              <Input
                type="number"
                value={interestRate}
                onChange={(e) => handleNumberInput(
                  e.target.value,
                  setInterestRate,
                  0,
                  20,
                  true
                )}
                min={0}
                max={20}
                step={0.1}
                className="text-right"
              />
            </div>
            <div className="flex-shrink-0 w-8">%</div>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Term</Label>
          <div className="flex items-center space-x-4">
            <div className="flex-grow">
              <Slider
                value={[term]}
                onValueChange={(value) => setTerm(value[0])}
                min={12}
                max={72}
                step={12}
              />
            </div>
            <div className="flex-shrink-0 w-24">
              <Input
                type="number"
                value={term}
                onChange={(e) => handleNumberInput(
                  e.target.value,
                  setTerm,
                  12,
                  72,
                  false
                )}
                min={12}
                max={72}
                step={12}
                className="text-right"
              />
            </div>
            <div className="flex-shrink-0 w-20">months</div>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Balloon Payment</Label>
          <div className="flex items-center space-x-4">
            <div className="flex-grow">
              <Slider
                value={[balloonPayment]}
                onValueChange={(value) => setBalloonPayment(value[0])}
                min={0}
                max={50}
                step={1}
              />
            </div>
            <div className="flex-shrink-0 w-24">
              <Input
                type="number"
                value={balloonPayment}
                onChange={(e) => handleNumberInput(
                  e.target.value,
                  setBalloonPayment,
                  0,
                  50,
                  false
                )}
                min={0}
                max={50}
                step={1}
                className="text-right"
              />
            </div>
            <div className="flex-shrink-0 w-8">%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PurchaseDecisions;