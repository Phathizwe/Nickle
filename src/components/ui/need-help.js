// src/components/ui/need-help.js
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { HelpCircle } from "lucide-react";

export const NeedHelp = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        variant="outline"
        size="sm"
        className="bg-white shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <HelpCircle className="h-4 w-4 mr-2" />
        Need Help?
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Need Help?</DialogTitle>
            <DialogDescription>
              Get in touch with our support team for assistance.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>Contact us at support@nickle.com</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};