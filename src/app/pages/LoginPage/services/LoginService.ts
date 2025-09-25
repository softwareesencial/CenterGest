// services/LoginService.ts
import type { User } from "../../../auth/AuthProvider";
import { createClient } from "@supabase/supabase-js";

console.log("VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);

// Create Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

// API Response Types
export interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
    token: string;
    refreshToken?: string;
    expiresIn?: number;
  };
  errors?: Record<string, string[]>;
}

export interface RefreshTokenResponse {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    user?: User;
    expiresIn?: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

class LoginService {
  // Login method
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return {
        success: true,
        data: {
          token: data.session?.access_token,
          refreshToken: data.session?.refresh_token,
          user: {
            id: data.user?.id,
            email: data.user?.email!,
            name: data.user?.user_metadata?.name || "",
            userType: data.user?.user_metadata?.role || "user",
          },
          expiresIn: data.session?.expires_in,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Login failed",
        errors: { auth: [error.message] },
      };
    }
  }

  // Logout method
  async logout(): Promise<ApiResponse> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      return {
        success: true,
        message: "Logged out successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Logout failed",
      };
    }
  }

  // Reset password method
  async resetPassword(email: string): Promise<ApiResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      return {
        success: true,
        message: "Password reset instructions sent to your email",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Password reset failed",
      };
    }
  }

  // Get current user
  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) throw error;
      if (!user) throw new Error("No user found");

      return {
        success: true,
        data: {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || "",
          userType: user.user_metadata?.role || "user",
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get user profile",
      };
    }
  }

  async refreshToken(currentToken: string): Promise<RefreshTokenResponse> {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        return {
          success: false,
          message: error.message,
        };
      }

      return {
        success: true,
        data: {
          token: data.session?.access_token ?? "",
          expiresIn: data.session?.expires_in,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Error refreshing token",
      };
    }
  }
}

// Create and export a singleton instance
export const loginService = new LoginService();

// Export the class for custom configurations
export { LoginService };
