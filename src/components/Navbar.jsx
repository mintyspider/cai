// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X, LogOut, User, Sparkles, MessageSquare, BookOpen, Home, ExternalLink } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import toast from "react-hot-toast";

export function Navbar({ user, onLogout, toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Функция для открытия руководства
  const openGuide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Открываем внешнюю ссылку в новой вкладке
    window.open(
      'https://se.cs.petrsu.ru/wiki/CAI:_Руководство_пользователя', 
      '_blank', 
      'noopener,noreferrer'
    );
    
    // Закрываем мобильное меню если открыто
    setMobileOpen(false);
  };

  const navItems = user
    ? [
        { label: "Конструктор", path: "/builder", icon: Sparkles },
        { label: "Диалоги", path: "/dialogs", icon: MessageSquare },
        { label: "Профиль", path: "/profile", icon: User },
      ]
    : [
        { label: "Главная", path: "/", icon: Home },
        { 
          label: "Руководство", 
          path: "#", // Используем # чтобы не было перехода
          icon: BookOpen,
          external: true, // Флаг что это внешняя ссылка
          onClick: openGuide
        },
        { label: "Вход", path: "/login" },
        { label: "Регистрация", path: "/register" },
      ];

  const handleLogout = () => {
    onLogout();
    navigate("/");
    toast.success("Вы вышли из аккаунта. До новых встреч 😊");
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white/80 dark:bg-gray-900/90 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Логотип */}
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-10" />
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <ThemeToggle />

            {navItems.map((item) => {
              // Если это внешняя ссылка (руководство)
              if (item.external) {
                return (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    {item.label}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </button>
                );
              }
              
              // Обычные внутренние ссылки
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.label}
                </Link>
              );
            })}

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
              onClick={() => {
                if (user && toggleSidebar) {
                  toggleSidebar();
                } else {
                  setMobileOpen(!mobileOpen);
                }
              }}
              className="text-gray-700 dark:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-b-lg shadow-lg">
            {navItems.map((item) => {
              // Если это внешняя ссылка (руководство)
              if (item.external) {
                return (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className="flex items-center gap-3 w-full text-left px-6 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {item.icon && <item.icon className="w-5 h-5" />}
                    {item.label}
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </button>
                );
              }
              
              // Обычные внутренние ссылки
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-6 py-3 text-base font-medium transition-colors ${
                    isActive(item.path)
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  {item.label}
                </Link>
              );
            })}
            
            {user && (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="flex items-center gap-3 w-full text-left px-6 py-3 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Выйти
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}