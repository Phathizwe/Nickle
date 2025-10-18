// src/components/auth/MicrosoftSignIn.js
import React, { useState } from 'react';
import { Button } from "../ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../ui/use-toast";
import { Loader2 } from "lucide-react";

const MicrosoftSignIn = ({ 
  onSuccess, 
  onError, 
  className = "", 
  isRegistering = false,
  disabled = false 
}) => {
  const { signInWithMicrosoft } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleMicrosoftAuth = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const user = await signInWithMicrosoft(isRegistering);
      
      toast({
        title: "Success",
        description: `Successfully ${isRegistering ? 'registered' : 'signed in'} with Microsoft!`,
      });
      
      if (onSuccess) {
        await onSuccess(user);
      }
    } catch (error) {
      console.error("Microsoft auth error:", error);
      
      let errorMessage = "Failed to authenticate with Microsoft";
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = "Sign-in window was closed";
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = "Sign-in process was cancelled";
          break;
        case 'auth/popup-blocked':
          errorMessage = "Sign-in window was blocked by browser";
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = "An account already exists with this email";
          break;
        default:
          errorMessage = error.message;
      }
      
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleMicrosoftAuth}
      variant="outline"
      className={`relative w-full flex items-center justify-center gap-2 ${className}`}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <svg 
          className="h-5 w-5" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="#f25022" d="M11.4 24H0V12.6h11.4V24Z"/>
          <path fill="#00a4ef" d="M24 24H12.6V12.6H24V24Z"/>
          <path fill="#7fba00" d="M11.4 11.4H0V0h11.4v11.4Z"/>
          <path fill="#ffb900" d="M24 11.4H12.6V0H24v11.4Z"/>
        </svg>
      )}
      <span>
        {isLoading 
          ? (isRegistering ? 'Registering...' : 'Signing in...') 
          : (isRegistering ? 'Register with Microsoft' : 'Sign in with Microsoft')
        }
      </span>
    </Button>
  );
};

export default MicrosoftSignIn;
