import { useState, useEffect, useCallback } from 'react';
import { User, HistoryItem, AnalysisType, SeoResult } from '../types';
import { FREE_TIER_REQUEST_LIMIT } from '../constants';

const APP_STORAGE_KEY = 'seoBoosterUser';

const getInitialUser = (): User => {
  try {
    const item = window.localStorage.getItem(APP_STORAGE_KEY);
    if (item) {
      const parsed = JSON.parse(item);
      // Basic validation
      if (typeof parsed.isPremium === 'boolean' && typeof parsed.requestCount === 'number') {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Error reading from localStorage', error);
  }
  return {
    isPremium: false,
    requestCount: 0,
    history: [],
  };
};

export const useUser = () => {
  const [user, setUser] = useState<User>(getInitialUser);

  useEffect(() => {
    try {
      window.localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.warn('Error writing to localStorage', error);
    }
  }, [user]);
  
  const canMakeRequest = !user.isPremium && user.requestCount >= FREE_TIER_REQUEST_LIMIT;

  const addHistory = useCallback((type: AnalysisType, input: string, result: SeoResult) => {
    setUser(prevUser => {
      const newHistoryItem: HistoryItem = {
        id: new Date().toISOString(),
        type,
        input,
        result,
        timestamp: Date.now(),
      };
      
      const newRequestCount = prevUser.isPremium ? prevUser.requestCount : prevUser.requestCount + 1;

      return {
        ...prevUser,
        requestCount: newRequestCount,
        history: [newHistoryItem, ...prevUser.history].slice(0, 50), // Keep last 50
      };
    });
  }, []);

  const deleteHistoryItem = useCallback((id: string) => {
    setUser(prevUser => ({
      ...prevUser,
      history: prevUser.history.filter(item => item.id !== id),
    }));
  }, []);

  const clearHistory = useCallback(() => {
    setUser(prevUser => ({
      ...prevUser,
      history: [],
    }));
  }, []);

  const upgradeToPremium = useCallback((email: string) => {
    setUser(prevUser => ({
      ...prevUser,
      isPremium: true,
      email,
    }));
  }, []);
  
  const clearPersonalData = useCallback(() => {
    setUser({
      isPremium: false,
      requestCount: 0,
      history: [],
    });
    // The useEffect will persist this cleared state to localStorage
  }, []);

  return {
    user,
    canMakeRequest,
    requestsLeft: FREE_TIER_REQUEST_LIMIT - user.requestCount,
    addHistory,
    deleteHistoryItem,
    clearHistory,
    upgradeToPremium,
    clearPersonalData
  };
};