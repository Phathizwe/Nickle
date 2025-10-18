// src/components/PageErrorBoundary.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

class PageErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Page error:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-8">
            We're sorry for the inconvenience. Please try refreshing the page or going back to the homepage.
          </p>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
            <Button
              onClick={() => {
                // Clear any state that might be causing the error
                localStorage.removeItem('initialNetSalary');
                window.history.replaceState({}, document.title);
                window.location.href = '/';
              }}
            >
              Go to Homepage
            </Button>
          </div>
          {process.env.NODE_ENV !== 'production' && this.state.error && (
            <div className="mt-8 p-4 bg-gray-100 rounded text-left overflow-auto max-w-full">
              <p className="font-mono text-sm text-red-600">{this.state.error.toString()}</p>
              <p className="font-mono text-sm mt-2">{this.state.errorInfo?.componentStack}</p>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default PageErrorBoundary;