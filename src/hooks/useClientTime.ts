"use client";

import { useState, useEffect } from 'react';

export function useClientTime() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

export function formatTime(date: Date, isClient: boolean) {
  if (!isClient) {
    // Return a consistent placeholder for server-side rendering
    return '--:--';
  }
  
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(date: Date, isClient: boolean) {
  if (!isClient) {
    // Return a consistent placeholder for server-side rendering
    return '----/--/--';
  }
  
  return date.toLocaleDateString();
}

// Create a date safely for components
export function createClientDate() {
  return new Date();
}
