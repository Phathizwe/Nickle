import { toast } from '../../ui/use-toast';  // Update to use shadcn/ui toast

export const showSuccess = (message) => {
  toast({
    title: "Success",
    description: message,
    variant: "default",
  });
};

export const showError = (message) => {
  toast({
    title: "Error",
    description: message,
    variant: "destructive",
  });
};