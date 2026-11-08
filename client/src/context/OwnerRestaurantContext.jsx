/**
 * OwnerRestaurantContext — Manages the active restaurant selection and
 * owned restaurants list for the restaurant-owner portal.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRestaurantById, updateRestaurant } from '@/services/restaurant.service';
import { useToast } from '@/context/ToastContext';

const OwnerRestaurantContext = createContext(null);

// Complete seeded restaurants owned by demo owner (owner@foodhub.com) in MongoDB
const DEFAULT_OWNED_RESTAURANTS = [
  {
    _id: '6895eb520002000000000000',
    name: 'Annapurna Tandoor House',
    city: 'Bhopal',
    area: 'New Market',
    cuisines: ['North Indian', 'Desserts'],
    isOpen: true,
  },
  {
    _id: '68d2a82b00020000000186a0',
    name: 'Saffron Udupi',
    city: 'Mumbai',
    area: 'Powai',
    cuisines: ['South Indian', 'Desserts', 'Pizza'],
    isOpen: true,
  },
  {
    _id: '68cda3280002000000030d40',
    name: 'Masala Kitchen',
    city: 'Indore',
    area: 'Rau',
    cuisines: ['North Indian', 'Biryani', 'Desserts'],
    isOpen: true,
  },
  {
    _id: '67472a4b00020000000493e0',
    name: 'Mirchi Bhavan',
    city: 'Bengaluru',
    area: 'Marathahalli',
    cuisines: ['South Indian', 'Pizza'],
    isOpen: true,
  },
  {
    _id: '67f106790002000000061a80',
    name: 'Swad Kitchen',
    city: 'Bhopal',
    area: 'Arera Colony',
    cuisines: ['North Indian', 'Street Food'],
    isOpen: true,
  },
  {
    _id: '689cf659000200000007a120',
    name: 'Namaste Dessert Bar',
    city: 'Mumbai',
    area: 'Powai',
    cuisines: ['Desserts', 'North Indian', 'Chinese'],
    isOpen: true,
  },
  {
    _id: '68e53b7700020000000927c0',
    name: 'Namaste Dessert Bar',
    city: 'Bhopal',
    area: 'Shahpura',
    cuisines: ['Desserts', 'Street Food'],
    isOpen: true,
  },
  {
    _id: '67d253ce00020000000aae60',
    name: "Sharma's Tandoor House",
    city: 'Pune',
    area: 'Shivajinagar',
    cuisines: ['North Indian', 'Biryani'],
    isOpen: true,
  },
  {
    _id: '6785714900020000000c3500',
    name: 'Saffron Idli House',
    city: 'Bhopal',
    area: 'Indrapuri',
    cuisines: ['South Indian', 'Pizza', 'Street Food'],
    isOpen: true,
  },
  {
    _id: '68110e5300020000000dbba0',
    name: "Gupta's Rasoi, Mansarovar",
    city: 'Jaipur',
    area: 'Mansarovar',
    cuisines: ['North Indian', 'Biryani', 'South Indian'],
    isOpen: true,
  },
];

export function OwnerRestaurantProvider({ children }) {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  // Load owned restaurants list from localStorage or fallback to defaults
  const [restaurants, setRestaurants] = useState(() => {
    try {
      const stored = localStorage.getItem('foodhub_owner_restaurants');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_OWNED_RESTAURANTS;
  });

  // Selected active restaurant ID
  const [selectedId, setSelectedId] = useState(() => {
    try {
      const storedId = localStorage.getItem('foodhub_owner_selected_id');
      if (storedId && restaurants.some((r) => r._id === storedId)) {
        return storedId;
      }
    } catch {}
    return restaurants[0]?._id || '6895eb520002000000000000';
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('foodhub_owner_restaurants', JSON.stringify(restaurants));
      localStorage.setItem('foodhub_owner_selected_id', selectedId);
    } catch {}
  }, [restaurants, selectedId]);

  // Fetch full details of the currently selected restaurant
  const {
    data: activeData,
    isLoading: isLoadingActive,
    isError: isErrorActive,
    refetch: refetchActive,
  } = useQuery({
    queryKey: ['owner', 'restaurant', selectedId],
    queryFn: () => getRestaurantById(selectedId),
    enabled: Boolean(selectedId),
    staleTime: 60_000,
  });

  const activeRestaurant = activeData?.restaurant;

  // Toggle open/closed status via PATCH /api/restaurants/:id
  const toggleStatusMutation = useMutation({
    mutationFn: (newStatus) =>
      updateRestaurant(selectedId, { isOpen: newStatus }),
    onSuccess: (data, newStatus) => {
      success(
        'Status Updated',
        `Kitchen is now ${newStatus ? 'OPEN and accepting orders' : 'CLOSED / PAUSED'}.`
      );
      // Update in local list
      setRestaurants((prev) =>
        prev.map((r) => (r._id === selectedId ? { ...r, isOpen: newStatus } : r))
      );
      queryClient.invalidateQueries({ queryKey: ['owner', 'restaurant', selectedId] });
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Failed to update restaurant status.';
      toastError('Update Failed', msg);
    },
  });

  const toggleRestaurantOpen = useCallback(() => {
    if (!activeRestaurant) return;
    toggleStatusMutation.mutate(!activeRestaurant.isOpen);
  }, [activeRestaurant, toggleStatusMutation]);

  // Add a newly created restaurant to the owner's list
  const addRestaurant = useCallback((newRest) => {
    setRestaurants((prev) => [newRest, ...prev]);
    setSelectedId(newRest._id);
  }, []);

  // Update restaurant in list after edit
  const updateRestaurantInList = useCallback((updatedRest) => {
    setRestaurants((prev) =>
      prev.map((r) => (r._id === updatedRest._id ? { ...r, ...updatedRest } : r))
    );
  }, []);

  // Remove restaurant from list after deletion
  const removeRestaurantFromList = useCallback(
    (deletedId) => {
      setRestaurants((prev) => {
        const remaining = prev.filter((r) => r._id !== deletedId);
        if (selectedId === deletedId && remaining.length > 0) {
          setSelectedId(remaining[0]._id);
        }
        return remaining;
      });
    },
    [selectedId]
  );

  const value = {
    selectedId,
    setSelectedId,
    restaurants,
    activeRestaurant,
    isLoadingActive,
    isErrorActive,
    refetchActive,
    toggleRestaurantOpen,
    isUpdatingStatus: toggleStatusMutation.isLoading,
    addRestaurant,
    updateRestaurantInList,
    removeRestaurantFromList,
  };

  return (
    <OwnerRestaurantContext.Provider value={value}>
      {children}
    </OwnerRestaurantContext.Provider>
  );
}

export function useOwnerRestaurant() {
  const ctx = useContext(OwnerRestaurantContext);
  if (!ctx) {
    throw new Error('useOwnerRestaurant must be used within <OwnerRestaurantProvider>');
  }
  return ctx;
}
