import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { TeamMember } from '@shared/schema';

interface TeamAuthContextType {
  user: TeamMember | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  login: (user: TeamMember) => void;
  logout: () => void;
}

const TeamAuthContext = createContext<TeamAuthContextType | undefined>(undefined);

export function TeamAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TeamMember | null>(null);
  const queryClient = useQueryClient();

  // Check if team member is authenticated on app load
  const { data: authData, isLoading } = useQuery({
    queryKey: ['/api/team/me'],
    retry: false,
    queryFn: async () => {
      const response = await fetch('/api/team/me', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Not authenticated');
      return response.json();
    },
  });

  useEffect(() => {
    if (authData?.user) {
      setUser(authData.user);
    } else {
      setUser(null);
    }
  }, [authData]);

  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const login = (userData: TeamMember) => {
    setUser(userData);
    // Invalidate and refetch the auth query to ensure state consistency
    queryClient.invalidateQueries({ queryKey: ['/api/team/me'] });
  };

  const logout = async () => {
    try {
      await fetch('/api/team/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    // Invalidate auth queries on logout
    queryClient.invalidateQueries({ queryKey: ['/api/team/me'] });
  };

  return (
    <TeamAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        hasRole,
        hasAnyRole,
        login,
        logout,
      }}
    >
      {children}
    </TeamAuthContext.Provider>
  );
}

export function useTeamAuth() {
  const context = useContext(TeamAuthContext);
  if (context === undefined) {
    throw new Error('useTeamAuth must be used within a TeamAuthProvider');
  }
  return context;
}