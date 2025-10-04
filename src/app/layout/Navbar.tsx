import React, { useState } from "react";
import { HomeIcon, Calendar, User, File, Menu, X, Notebook } from "lucide-react";
import { Link } from "react-router-dom"; // Assuming you're using React Router

interface NavbarProps {
  title?: string;
  className?: string;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({
  title = "",
  className = "",
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pages: NavItem[] = [
    { name: "Inicio", path: "/", icon: <HomeIcon className="w-5 h-5" /> },
    {
      name: "Calendario",
      path: "/calendar",
      icon: <Calendar className="w-5 h-5" />,
    },
    { name: "Clientes", path: "/clients", icon: <User className="w-5 h-5" /> },
    {
      name: "Terapistas",
      path: "/therapists",
      icon: <User className="w-5 h-5" />,
    },
    {
      name: "Servicios",
      path: "/services",
      icon: <Notebook className="size-5"/>,
    },
    { name: "Reportes", path: "/reports", icon: <File className="w-5 h-5" /> },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`bg-white shadow-lg border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
              {title}
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {pages.map((page) => (
                <Link
                  key={page.name}
                  to={page.path}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label={`Navegar a ${page.name}`}
                >
                  {page.icon}
                  <span>{page.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
              aria-expanded={isMobileMenuOpen}
              aria-label="Abrir menú principal"
            >
              <span className="sr-only">Abrir menú principal</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200">
          {pages.map((page) => (
            <Link
              key={page.name}
              to={page.path}
              onClick={closeMobileMenu}
              className="flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={`Navegar a ${page.name}`}
            >
              {page.icon}
              <span>{page.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}
    </nav>
  );
};
