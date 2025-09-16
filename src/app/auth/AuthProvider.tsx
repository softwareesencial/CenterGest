// contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { loginService } from "../pages/LoginPage/services/LoginService";

// Types
export interface User {
  id: string | number;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  permissions?: string[];
  avatar?: string;
  [key: string]: any; // Allow for additional user properties
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  clearError: () => void;
  updateUser: (userData: Partial<User>) => void;
}

// Configuration interface for easy adaptation
export interface AuthConfig {
  tokenStorageKey?: string;
  userStorageKey?: string;
  apiBaseUrl?: string;
  autoRefreshToken?: boolean;
  refreshInterval?: number; // in minutes
  redirectAfterLogin?: string;
  redirectAfterLogout?: string;
}

// Default configuration
const defaultConfig: AuthConfig = {
  tokenStorageKey: "authToken",
  userStorageKey: "authUser",
  autoRefreshToken: true,
  refreshInterval: 15, // 15 minutes
  redirectAfterLogin: "/dashboard",
  redirectAfterLogout: "/login",
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider Props
interface AuthProviderProps {
  children: ReactNode;
  config?: Partial<AuthConfig>;
}

// AuthProvider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  config: userConfig = {},
}) => {
  const config = { ...defaultConfig, ...userConfig };

  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem(config.tokenStorageKey!);
        const storedUser = localStorage.getItem(config.userStorageKey!);

        if (storedToken && storedUser) {
          const userData = JSON.parse(storedUser);

          // Verify token is still valid
          const isValid = await loginService.verifyToken(storedToken);

          if (isValid) {
            setAuthState({
              user: userData,
              token: storedToken,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            // Set up auto refresh if enabled
            if (config.autoRefreshToken) {
              setupTokenRefresh();
            }
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem(config.tokenStorageKey!);
            localStorage.removeItem(config.userStorageKey!);
            setAuthState((prev) => ({ ...prev, isLoading: false }));
          }
        } else {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, []);

  // Set up automatic token refresh
  const setupTokenRefresh = () => {
    const interval = setInterval(async () => {
      if (authState.isAuthenticated) {
        await refreshToken();
      }
    }, config.refreshInterval! * 60 * 1000); // Convert minutes to milliseconds

    return () => clearInterval(interval);
  };

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await loginService.login(email, password);

      if (response.success && response.data) {
        const { user, token } = response.data;

        // Store in localStorage
        localStorage.setItem(config.tokenStorageKey!, token);
        localStorage.setItem(config.userStorageKey!, JSON.stringify(user));

        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        // Set up auto refresh if enabled
        if (config.autoRefreshToken) {
          setupTokenRefresh();
        }

        return true;
      } else {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: response.message || "Login failed",
        }));
        return false;
      }
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || "An error occurred during login",
      }));
      return false;
    }
  };

  // Logout function
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem(config.tokenStorageKey!);
    localStorage.removeItem(config.userStorageKey!);

    // Reset auth state
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });

    // Call logout API if available
    loginService.logout().catch(console.error);
  };

  // Refresh token function
  const refreshToken = async (): Promise<boolean> => {
    try {
      if (!authState.token) return false;

      const response = await loginService.refreshToken(authState.token);

      if (response.success && response.data) {
        const { token: newToken, user: updatedUser } = response.data;

        // Update localStorage
        localStorage.setItem(config.tokenStorageKey!, newToken);
        if (updatedUser) {
          localStorage.setItem(
            config.userStorageKey!,
            JSON.stringify(updatedUser)
          );
        }

        setAuthState((prev) => ({
          ...prev,
          token: newToken,
          user: updatedUser || prev.user,
        }));

        return true;
      } else {
        // Refresh failed, logout user
        logout();
        return false;
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      logout();
      return false;
    }
  };

  // Clear error function
  const clearError = () => {
    setAuthState((prev) => ({ ...prev, error: null }));
  };

  // Update user function
  const updateUser = (userData: Partial<User>) => {
    if (!authState.user) return;

    const updatedUser = { ...authState.user, ...userData };

    localStorage.setItem(config.userStorageKey!, JSON.stringify(updatedUser));
    setAuthState((prev) => ({ ...prev, user: updatedUser }));
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    refreshToken,
    clearError,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// useAuth hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Higher-order component for protecting routes
export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      // You can redirect here or show a login component
      window.location.href = "/login";
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

// Hook for checking permissions
export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permission: string): boolean => {
    return user?.permissions?.includes(permission) || false;
  };

  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return user?.role ? roles.includes(user.role) : false;
  };

  return {
    hasPermission,
    hasRole,
    hasAnyRole,
    permissions: user?.permissions || [],
    role: user?.role || null,
  };
};
