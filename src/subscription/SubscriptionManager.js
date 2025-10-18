// src/components/subscription/SubscriptionManager.js
import { useState } from 'react';
import { Button } from "../ui/button";
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../ui/use-toast';

export const SubscriptionManager = () => {
  const { user, subscription } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const startSubscription = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to upgrade to premium",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Here you would implement your own subscription logic
      toast({
        title: "Success",
        description: "Welcome to Premium!",
      });
    } catch (error) {
      console.error('Error starting subscription:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to start subscription",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-4">
      {subscription ? (
        <div className="p-4 border rounded-lg">
          <h3 className="font-bold mb-2">Premium Features Active</h3>
          <p className="text-sm text-gray-600">
            Next billing date: {new Date(subscription?.current_period_end).toLocaleDateString()}
          </p>
        </div>
      ) : (
        <Button 
          onClick={startSubscription} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Processing...' : 'Upgrade to Premium'}
        </Button>
      )}
    </div>
  );
};
