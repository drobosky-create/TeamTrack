import { useQuery, useMutation } from "@tanstack/react-query";
import { getQueryFn, queryClient, apiRequest } from "@/lib/queryClient";

export function useAuth() {
  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }), // Return null on 401 instead of throwing
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/logout");
      return response.json();
    },
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
      // Force refetch to get null user
      refetch();
      // Redirect to landing page
      window.location.href = "/";
    },
    onError: (error) => {
      console.error("Logout error:", error);
      // Even if logout fails, clear local cache and redirect
      queryClient.clear();
      window.location.href = "/";
    }
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    logout: () => logoutMutation.mutate(),
    isLoggingOut: logoutMutation.isPending,
  };
}