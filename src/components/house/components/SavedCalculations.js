import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../ui/card";
import { formatCurrency } from '../utils/formatters';

const SavedCalculations = ({ calculations, onLoadCalculation }) => {
  if (!calculations?.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Calculations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {calculations.map((calc) => (
            <div
              key={calc.id}
              className="flex justify-between items-center p-2 bg-gray-50 hover:bg-gray-100 rounded cursor-pointer"
              onClick={() => onLoadCalculation(calc)}
            >
              <div>
                <p className="font-medium">{calc.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(calc.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p>{formatCurrency(calc.data.affordableHousePrice)}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedCalculations;