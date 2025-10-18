// components/LoanDetails.js
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Slider } from "../../ui/slider";

export default function LoanDetails({
  downPaymentPercentage,
  setDownPaymentPercentage,
  term,
  setTerm,
  interestRate,
  setInterestRate
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Details</CardTitle>
        <CardDescription>Configure your home loan preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Down Payment: {downPaymentPercentage}%</Label>
          <Slider
            value={[downPaymentPercentage]}
            onValueChange={(value) => setDownPaymentPercentage(value[0])}
            min={0}
            max={100}
            step={1}
          />
        </div>
        <div>
          <Label htmlFor="term">Loan Term (months)</Label>
          <Input
            id="term"
            type="number"
            value={term}
            onChange={(e) => setTerm(parseInt(e.target.value))}
            min={12}
            max={360}
          />
        </div>
        <div>
          <Label htmlFor="interestRate">Interest Rate (%)</Label>
          <Input
            id="interestRate"
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(parseFloat(e.target.value))}
            step={0.1}
          />
        </div>
      </CardContent>
    </Card>
  );
}