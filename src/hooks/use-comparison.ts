'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';

const COMPARISON_KEY = 'vehicleComparison';

export function useComparison() {
  const [comparison, setComparison] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const items = window.localStorage.getItem(COMPARISON_KEY);
      if (items) {
        setComparison(JSON.parse(items));
      }
    } catch (error) {
      console.error('Failed to read from localStorage', error);
    }
  }, []);

  const updateLocalStorage = (items: string[]) => {
    try {
      window.localStorage.setItem(COMPARISON_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to write to localStorage', error);
    }
  };

  const addToComparison = useCallback(
    (vehicleId: string) => {
      setComparison((currentComparison) => {
        if (currentComparison.includes(vehicleId)) {
          toast({
            title: 'Already in comparison',
            description: 'This vehicle is already in your comparison list.',
            variant: 'default',
          });
          return currentComparison;
        }
        if (currentComparison.length >= 4) {
          toast({
            title: 'Comparison list full',
            description: 'You can compare a maximum of 4 vehicles at a time.',
            variant: 'destructive',
          });
          return currentComparison;
        }
        const newComparison = [...currentComparison, vehicleId];
        updateLocalStorage(newComparison);
        toast({
          title: 'Added to comparison',
          description: 'The vehicle has been added to your comparison list.',
        });
        return newComparison;
      });
    },
    [toast]
  );

  const removeFromComparison = useCallback(
    (vehicleId: string) => {
      setComparison((currentComparison) => {
        const newComparison = currentComparison.filter((id) => id !== vehicleId);
        if (newComparison.length < currentComparison.length) {
          updateLocalStorage(newComparison);
          toast({
            title: 'Removed from comparison',
            description: 'The vehicle has been removed from your list.',
          });
          return newComparison;
        }
        return currentComparison;
      });
    },
    [toast]
  );

  const clearComparison = useCallback(() => {
    setComparison((currentComparison) => {
      if (currentComparison.length > 0) {
        updateLocalStorage([]);
        toast({
          title: 'Comparison cleared',
          description: 'Your comparison list has been cleared.',
        });
        return [];
      }
      return currentComparison;
    });
  }, [toast]);

  return { comparison, addToComparison, removeFromComparison, clearComparison };
}
