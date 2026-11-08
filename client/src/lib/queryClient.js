/**
 * TanStack Query client configuration.
 * Centralised defaults so every query behaves predictably.
 */
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 60 seconds — avoids hammering the API on
      // every navigation while keeping menus/orders reasonably up to date.
      staleTime: 60 * 1000,
      // Keep data in cache for 5 minutes even after the component unmounts.
      gcTime: 5 * 60 * 1000,
      // Only retry once on failure (network blip) — not on 4xx errors.
      retry: (failureCount, error) => {
        const status = error?.response?.status;
        if (status && status >= 400 && status < 500) return false;
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

export default queryClient;

