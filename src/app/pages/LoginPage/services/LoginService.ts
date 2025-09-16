// services/LoginService.ts
import type { User } from "../../../auth/AuthProvider";
import apiClient from "../../../common/config";

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
      // Mocked Login response for demonstration purposes
      return {
        success: true,
        data: {
          token: "1",
          refreshToken: "1",
          user: { id: 1, email, name: "Test User", userType: "admin" }, // Mock user data
        },
      };
      const response = await apiClient.post("/auth/login", {
        email,
        password,
      });

      return {
        success: true,
        data: response.data,
        message: response.data?.message,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
        errors: error.response?.data?.errors,
      };
    }
  }

  // Logout method
  async logout(): Promise<ApiResponse> {
    try {
      const response = await apiClient.post("/auth/logout");

      return {
        success: true,
        data: response.data,
        message: response.data?.message,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Logout failed",
      };
    }
  }

  // Refresh token method
  async refreshToken(currentToken: string): Promise<RefreshTokenResponse> {
    try {
      const response = await apiClient.post(
        "/auth/refresh",
        { token: currentToken },
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        }
      );

      return {
        success: true,
        data: response.data,
        message: response.data?.message,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Token refresh failed",
      };
    }
  }

  // Verify token method
  async verifyToken(token: string): Promise<boolean> {
    try {
      await apiClient.post(
        "/auth/verify",
        { token },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return true;
    } catch (error) {
      console.error("Token verification error:", error);
      return false;
    }
  }

  // Forgot password method
  async forgotPassword(email: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.post("/auth/forgot-password", {
        email,
      });

      return {
        success: true,
        data: response.data,
        message: response.data?.message,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Forgot password failed",
      };
    }
  }

  // Reset password method
  async resetPassword(
    token: string,
    password: string,
    passwordConfirmation: string
  ): Promise<ApiResponse> {
    try {
      const response = await apiClient.post("/auth/reset-password", {
        token,
        password,
        password_confirmation: passwordConfirmation,
      });

      return {
        success: true,
        data: response.data,
        message: response.data?.message,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Password reset failed",
      };
    }
  }

  // Register method
  async register(userData: {
    email: string;
    password: string;
    password_confirmation: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    [key: string]: any;
  }): Promise<LoginResponse> {
    try {
      const response = await apiClient.post("/auth/register", userData);

      return {
        success: true,
        data: response.data,
        message: response.data?.message,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
        errors: error.response?.data?.errors,
      };
    }
  }

  // Get current user profile
  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.get("/auth/me");

      return {
        success: true,
        data: response.data,
        message: response.data?.message,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to get user profile",
      };
    }
  }

  // Update user profile
  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.put("/auth/profile", userData);

      return {
        success: true,
        data: response.data,
        message: response.data?.message,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update profile",
        errors: error.response?.data?.errors,
      };
    }
  }

  // Change password
  async changePassword(
    currentPassword: string,
    newPassword: string,
    passwordConfirmation: string
  ): Promise<ApiResponse> {
    try {
      const response = await apiClient.post("/auth/change-password", {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: passwordConfirmation,
      });

      return {
        success: true,
        data: response.data,
        message: response.data?.message,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to change password",
        errors: error.response?.data?.errors,
      };
    }
  }

  // Helper method to check if user has specific permission
  async checkPermission(permission: string): Promise<boolean> {
    try {
      await apiClient.get(`/auth/permissions/${permission}`);
      return true;
    } catch {
      return false;
    }
  }

  // Method to get user permissions
  async getUserPermissions(): Promise<string[]> {
    try {
      const response = await apiClient.get("/auth/permissions");
      return response.data?.permissions || [];
    } catch {
      return [];
    }
  }
}

// Create and export a singleton instance
export const loginService = new LoginService();

// Export the class for custom configurations
export { LoginService };
