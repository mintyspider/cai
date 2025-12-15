// src/components/Navbar.jsx
import { Button } from "./ui/button";
import { Menu, X, LogOut, User, Sparkles } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import toast from "react-hot-toast";

export function Navbar({ user, setPage, currentPage, toggleSidebar }) {
  const setUser = useState(user);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = user
    ? [
        { label: "Конструктор", page: "builder", icon: Sparkles },
        { label: "Диалоги", page: "saved" },
        { label: "Коллекция", page: "favorites" },
        { label: "Профиль", page: "profile", icon: User },
      ]
    : [
        { label: "Вход", page: "login" },
        { label: "Регистрация", page: "register" },
        { label: "Руководство", page: "guide" },
      ];

  const handleLogout = () => {
    setUser(null);
    setPage("landing");
    toast.success("Вы вышли из аккаунта");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white/80 dark:bg-gray-900/90 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Логотип */}
          <button
            onClick={() => setPage("landing")}
            className="flex items-center"
          >
            <img src="/logo.png" alt="Logo" className="h-10" />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <ThemeToggle />

            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => setPage(item.page)}
                className={`flex items-center gap-1.5 text-sm font-medium transition-all duration-200 ${
                  currentPage === item.page
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                {item.label}
              </button>
            ))}

            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                <LogOut className="w-4 h-4 mr-1.5" />
                Выйти
              </Button>
            )}
          </nav>

          {/* Mobile: Theme + Menu */}
          <div className="flex items-center gap-4 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => (user ? toggleSidebar?.() : setMobileOpen(!mobileOpen))}
              className="text-gray-700 dark:text-gray-200"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && !user && (
          <nav className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  setPage(item.page);
                  setMobileOpen(false);
                }}
                className="block w-full text-left px-6 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}