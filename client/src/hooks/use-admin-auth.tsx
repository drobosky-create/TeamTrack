import { createContext, ReactNode, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

type AdminUser = {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
};

type AdminAuthContextType = {
  adminUser: AdminUser | null;
  isLoading: boolean;
  error: Error | null;
};

export const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const {
    data: adminUser,
    error,
    isLoading,
  } = useQuery<AdminUser | undefined, Error>({
    queryKey: ["/api/admin/user"],
    queryFn: async () => {
      const response = await fetch("/api/admin/user", {
        credentials: 'include'
      });
      
      if (response.status === 401) {
        return undefined; // Not authenticated
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch admin user');
      }
      
      return response.json();
    },
    retry: false,
  });

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser: adminUser ?? null,
        isLoading,
        error,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}