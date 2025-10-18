import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { budgetService } from '../services/budgetService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";
import { Loader2, Trash2 } from "lucide-react";

export const SaveDialog = ({
  isOpen,
  onClose,
  type = 'budget',
  initialData = {}
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedBudgets, setSavedBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);

  useEffect(() => {
    if (isOpen && user) {
      loadSavedBudgets();
    }
  }, [isOpen, user]);

  const loadSavedBudgets = async () => {
    try {
      setLoading(true);
      const budgets = await budgetService.getBudgets(user.uid);
      setSavedBudgets(budgets);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load saved budgets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please provide a name for your budget plan",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const budgetData = {
        name: name.trim(),
        notes: notes.trim(),
        type,
        data: initialData,
        timestamp: new Date().toISOString()
      };

      if (selectedBudget) {
        await budgetService.updateBudget(selectedBudget.id, budgetData);
      } else {
        await budgetService.saveBudget(user.uid, budgetData);
      }

      // Reset form
      setName('');
      setNotes('');
      setSelectedBudget(null);

      toast({
        title: "Success",
        description: "Budget plan saved successfully",
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save budget plan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (budgetId) => {
    try {
      setLoading(true);
      await budgetService.deleteBudget(budgetId);
      await loadSavedBudgets();
      toast({
        title: "Success",
        description: "Budget plan deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete budget plan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            Save Budget Plan
          </DialogTitle>
          <DialogDescription>
            {savedBudgets.length < 5 
              ? "Save your budget plan to access it later"
              : "You have reached the maximum limit of 5 saved budgets"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Saved Budgets List */}
          {savedBudgets.length > 0 && (
            <div className="space-y-2">
              <Label>Saved Budgets</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {savedBudgets.map((budget) => (
                  <div
                    key={budget.id}
                    className="flex items-center justify-between p-2 border rounded hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{budget.name}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(budget.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedBudget(budget);
                          setName(budget.name);
                          setNotes(budget.notes || '');
                        }}
                      >
                        Load
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(budget.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Budget Form */}
          {savedBudgets.length < 5 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My budget plan"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes or reminders"
                  disabled={loading}
                  className="h-24 resize-none"
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            {savedBudgets.length < 5 && (
              <Button
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  selectedBudget ? 'Update' : 'Save'
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SaveDialog;