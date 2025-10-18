// src/components/home/LoadBudgetDialog.js
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { format } from 'date-fns';

export const LoadBudgetDialog = ({
  isOpen,
  onClose,
  budgets,
  onLoadBudget,
  loading
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Load Saved Budget</DialogTitle>
          <DialogDescription>
            Select a budget to load
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : budgets.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No saved budgets found
            </p>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {budgets.map((budget) => (
                <div
                  key={budget.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{budget.name}</h4>
                    <p className="text-sm text-gray-500">
                      Created: {format(new Date(budget.createdAt), 'PPP')}
                    </p>
                    {budget.notes && (
                      <p className="text-sm text-gray-600 mt-1">{budget.notes}</p>
                    )}
                  </div>
                  <Button
                    onClick={() => onLoadBudget(budget)}
                    className="ml-4"
                  >
                    Load
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};