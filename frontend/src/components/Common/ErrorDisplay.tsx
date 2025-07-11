import { useState, useEffect } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorDisplayProps {
  error: Error | string;
  onRetry?: () => void;
}

export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <div className="alert alert-error">
      <div>
        <h3 className="font-bold">Something went wrong!</h3>
        <div className="text-xs">{errorMessage}</div>
      </div>
      {onRetry && (
        <div className="flex-none">
          <button className="btn btn-sm btn-outline" onClick={onRetry}>
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

interface FormErrorProps {
  errors: Record<string, string>;
}

export function FormErrors({ errors }: FormErrorProps) {
  if (Object.keys(errors).length === 0) return null;

  return (
    <div className="alert alert-error mb-4">
      <div>
        <h3 className="font-bold">Please fix the following errors:</h3>
        <ul className="list-disc list-inside text-sm mt-2">
          {Object.entries(errors).map(([field, message]) => (
            <li key={field}>{message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

interface ValidationMessageProps {
  message?: string;
  isError?: boolean;
}

export function ValidationMessage({ message, isError = true }: ValidationMessageProps) {
  if (!message) return null;

  return <div className={`text-xs mt-1 ${isError ? 'text-error' : 'text-success'}`}>{message}</div>;
}
