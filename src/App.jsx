// src/App.jsx
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

import { StartPage } from "./pages/StartPage"; // Готово!
import { Login } from "./pages/Login"; // Готово!
import { Register } from "./pages/Register"; // Готово!
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { ChangePassword } from "./pages/ChangePassword";
import { Profile } from "./pages/Profile"; // Готово!
import { Dialogs } from "./pages/Dialogs";
import { Favorites } from "./pages/Favorites";
import { Dialog } from "./pages/Dialog";
import { PromptBuilder } from "./pages/PromptBuilder";
import { About } from "./pages/About";
import { Guide } from "./pages/Guide";

export default function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const protectedPages = ["profile", "dialogs", "favorites", "dialog", "builder", "change-password"];

useEffect(() => {
  if (window.location.search.includes("token=")) {
    setCurrentPage("login");
  }
}, []);

  // Автологин при загрузке
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (userStr && token) {
      try {
        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);
        setCurrentPage("profile");
      } catch (err) {
        console.error("Ошибка localStorage:", err);
        localStorage.clear();
      }
    }
    setIsLoading(false);
  }, []);

  // Защита маршрутов
  useEffect(() => {
    if (!isLoading && protectedPages.includes(currentPage) && !user) {
      setCurrentPage("login");
      toast.error("Сначала войдите в аккаунт");
    }
  }, [currentPage, user, isLoading]);

  // Умная смена страницы
  const goTo = (page) => {
    if (protectedPages.includes(page) && !user) {
      toast.error("Требуется авторизация");
      setCurrentPage("login");
    } else {
      setCurrentPage(page);
    }
  };

  // Логин
  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
    setCurrentPage("profile");
    toast.success(`С возвращением, ${ userData.username || "друг"}!`);
  };

  // Логаут
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setCurrentPage("landing");
    toast.success("Вы вышли из аккаунта");
  };

  // Рендер страницы
  const Page = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      );
    }

    const pageProps = { setPage: goTo, user, setUser, onLogin: login, onLogout: logout };

    if (protectedPages.includes(currentPage) && !user) {
      return <Login {...pageProps} />;
    }

    switch (currentPage) {
      case "landing":
      case "start":      return <StartPage {...pageProps} />;
      case "login":      return <Login {...pageProps} />;
      case "register":   return <Register {...pageProps} />;
      case "forgot":     return <ForgotPassword {...pageProps} />;
      case "reset":      return <ResetPassword {...pageProps} />;
      case "profile":    return <Profile {...pageProps} />;
      case "dialogs":    return <Dialogs {...pageProps} />;
      case "favorites":  return <Favorites {...pageProps} />;
      case "dialog":     return <Dialog {...pageProps} />;
      case "builder":    return <PromptBuilder {...pageProps} />;
      case "change-password": return <ChangePassword {...pageProps} />;
      case "about":      return <About {...pageProps} />;
      case "guide":      return <Guide {...pageProps} />;
      default:           return user ? <Profile {...pageProps} /> : <StartPage {...pageProps} />;
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} setPage={goTo} onLogout={logout} currentPage={currentPage} />
        
        <main className="flex-1 bg-gray-50">
          <Page />
        </main>

        <Footer />
      </div>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: { background: "#2563EB", color: "#fff" },
          success: { duration: 3000 },
          error: { duration: 5000 },
        }}
      />
    </>
  );
}