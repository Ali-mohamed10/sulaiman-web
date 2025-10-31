import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Helper function to format dates
// You can add more utility functions here as needed
export function formatDate(date, options = {}) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    ...options,
  });
}

// Add any other utility functions your application might need
