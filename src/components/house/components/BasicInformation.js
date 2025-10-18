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

export default function BasicInformation({ 
  netSalary, 
  setNetSalary, 
  budgetPercentage, 
  setBudgetPercentage 
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>Enter your financial details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="netSalary">Monthly Net Salary</Label>
          <Input
            id="netSalary"
            type="number"
            value={netSalary}
            onChange={(e) => setNetSalary(e.target.value)}
            placeholder="Enter your net monthly salary"
          />
        </div>
        <div>
          <Label>Housing Budget: {budgetPercentage}% of income</Label>
          <Slider
            value={[budgetPercentage]}
            onValueChange={(value) => setBudgetPercentage(value[0])}
            min={0}
            max={100}
            step={1}
          />
        </div>
      </CardContent>
    </Card>
  );
}