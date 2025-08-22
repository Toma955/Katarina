// src/components/Analytics.js
import { useEffect } from 'react';
import { track } from '@vercel/analytics';

export const CustomAnalytics = () => {
  useEffect(() => {
    // Track only essential events
    track('app_started');
    
    // Simple tracking function for key interactions
    window.trackEvent = (eventName) => {
      track(eventName);
    };

    return () => {
      delete window.trackEvent;
    };
  }, []);

  return null;
};

export default CustomAnalytics;
