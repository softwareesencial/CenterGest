// components/LoginPage.tsx
import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

// Configuration interface for easy customization
export interface LoginPageConfig {
  // Branding
  logo?: string | React.ReactNode;
  title?: string;
  subtitle?: string;
  companyName?: string;

  // Layout
  backgroundImage?: string;
  backgroundColor?: string;
  cardStyle?: "elevated" | "flat" | "bordered";
  layout?: "centered" | "split" | "minimal";

  // Features
  showRememberMe?: boolean;
  showForgotPassword?: boolean;
  showRegisterLink?: boolean;
  showSocialLogin?: boolean;

  // Customization
  primaryColor?: string;
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl";
  animation?: boolean;

  // URLs
  forgotPasswordUrl?: string;
  registerUrl?: string;

  // Validation
  customValidation?: (
    email: string,
    password: string
  ) => { isValid: boolean; errors: string[] };

  // Callbacks
  onLoginSuccess?: () => void;
  onLoginError?: (error: string) => void;
}

// Default configuration
const defaultConfig: LoginPageConfig = {
  title: "Bienvenido de nuevo",
  subtitle: "Inicia sesión en tu cuenta",
  companyName: "Tu Empresa",
  cardStyle: "elevated",
  layout: "centered",
  showRememberMe: true,
  showForgotPassword: true,
  showRegisterLink: true,
  showSocialLogin: false,
  primaryColor: "blue",
  borderRadius: "lg",
  animation: true,
  forgotPasswordUrl: "/forgot-password",
  registerUrl: "/register",
};

interface LoginPageProps {
  config?: Partial<LoginPageConfig>;
  onRedirect?: (url: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
  config: userConfig = {},
  onRedirect,
}) => {
  const config = { ...defaultConfig, ...userConfig };
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  // Animation mount effect
  useEffect(() => {
    if (config.animation) {
      setMounted(true);
    }
  }, [config.animation]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && onRedirect) {
      onRedirect("/dashboard");
    }
  }, [isAuthenticated, onRedirect]);

  // Clear errors when form changes
  useEffect(() => {
    if (error) {
      clearError();
    }
    setValidationErrors([]);
  }, [formData.email, formData.password]);

  // Form validation
  const validateForm = (): boolean => {
    const errors: string[] = [];

    // Email validation
    if (!formData.email) {
      errors.push("El correo electrónico es obligatorio");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.push("Por favor, introduce una dirección de correo válida");
    }

    // Password validation
    if (!formData.password) {
      errors.push("La contraseña es obligatoria");
    } else if (formData.password.length < 6) {
      errors.push("La contraseña debe tener al menos 6 caracteres");
    }

    // Custom validation if provided
    if (config.customValidation) {
      const customResult = config.customValidation(
        formData.email,
        formData.password
      );
      if (!customResult.isValid) {
        errors.push(...customResult.errors);
      }
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await login(formData.email, formData.password);

      if (success) {
        navigate('/')
      } else {
        config.onLoginError?.(error || "Login failed");
        console.error("Login failed:", error);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      config.onLoginError?.(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle navigation
  const handleNavigation = (url: string) => {
    if (onRedirect) {
      onRedirect(url);
    } else {
      window.location.href = url;
    }
  };

  // Get card classes based on style
  const getCardClasses = () => {
    const baseClasses = "w-full max-w-md p-8 bg-white";
    const radiusClasses = {
      none: "",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
    };

    const styleClasses = {
      elevated: "shadow-2xl",
      flat: "shadow-none",
      bordered: "border border-gray-200 shadow-sm",
    };

    return `${baseClasses} ${radiusClasses[config.borderRadius!]} ${
      styleClasses[config.cardStyle!]
    }`;
  };

  // Get container classes based on layout
  const getContainerClasses = () => {
    const baseClasses = "min-h-screen flex";

    if (config.backgroundImage) {
      return `${baseClasses} bg-cover bg-center bg-no-repeat`;
    }

    return `${baseClasses} ${config.backgroundColor || "bg-gray-50"}`;
  };

  // Animation classes
  const animationClasses =
    config.animation && mounted
      ? "transform transition-all duration-500 ease-out translate-y-0 opacity-100"
      : config.animation
      ? "transform translate-y-4 opacity-0"
      : "";

  return (
    <div
      className={getContainerClasses()}
      style={
        config.backgroundImage
          ? { backgroundImage: `url(${config.backgroundImage})` }
          : {}
      }
    >
      {/* Background overlay for image */}
      {config.backgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      )}

      <div className="relative flex-1 flex items-center justify-center p-6">
        <div className={`${getCardClasses()} ${animationClasses}`}>
          {/* Logo */}
          {config.logo && (
            <div className="text-center mb-8">
              {typeof config.logo === "string" ? (
                <img
                  src={config.logo}
                  alt={`${config.companyName} Logo`}
                  className="mx-auto h-12 w-auto"
                />
              ) : (
                config.logo
              )}
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {config.title}
            </h1>
            {config.subtitle && (
              <p className="text-gray-600">{config.subtitle}</p>
            )}
          </div>

          {/* Error Messages */}
          {(error || validationErrors.length > 0) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-800 mb-1">
                    Por favor, corrige los siguientes errores:
                  </h3>
                  <ul className="text-sm text-red-700 space-y-1">
                    {error && <li>{error}</li>}
                    {validationErrors.map((err, index) => (
                      <li key={index}>{err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Introduce tu correo electrónico"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Introduce tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading || isSubmitting ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>

          {/* First time Link */}
          {config.showRegisterLink && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Es tu primer ingreso?{" "}
                <button
                  onClick={() => handleNavigation(config.registerUrl!)}
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Haz clic aquí
                </button>
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              © 2024 {config.companyName}. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
