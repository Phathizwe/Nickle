// src/components/subscription/PricingModal.js
import React from 'react';
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export const PricingModal = ({ isOpen, onClose, onSubscribe }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Unlock Premium Features</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-bold">Premium Features</h3>
            <ul className="mt-2 space-y-2">
              <li>✓ Save unlimited calculations</li>
              <li>✓ Access calculation history</li>
              <li>✓ Export detailed reports</li>
              <li>✓ Sync across devices</li>
            </ul>
            <div className="mt-4">
              <p className="font-bold">7-Day Free Trial</p>
              <p className="text-sm text-gray-600">Then R9.99/month</p>
            </div>
          </div>
          <Button onClick={onSubscribe} className="w-full">
            Start Free Trial
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};