// src/components/Navbar.jsx
import { Button } from "./ui/button.jsx";
import { Menu, X, LogOut, User, Sparkles } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

export function Navbar({ user, setPage, setUser, currentPage, toggleSidebar }) {
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

  return (
    <header className="fixed bg-white top-0 left-0 right-0  border-b z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button
            onClick={() => setPage("landing")}
            className="text-xl font-bold text-blue-600"
          >
            <img src="logo.png" alt="" className="h-12" />
          </button>

          {/* Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <ThemeToggle/>
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => setPage(item.page)}
                className={`text-sm font-medium flex items-center gap-1 transition-colors ${
                  currentPage === item.page ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
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
                onClick={() => {
                  setUser(null);
                  setPage("landing");
                }}
              >
                <LogOut className="w-4 h-4 mr-1" />
                Выйти
              </Button>
            )}
          </nav>

          {/* Mobile */}
          <button
            onClick={() => user ? toggleSidebar() : setMobileOpen(!mobileOpen)}
            className="md:hidden"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && !user && (
          <nav className="md:hidden py-4 border-t">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  setPage(item.page);
                  setMobileOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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