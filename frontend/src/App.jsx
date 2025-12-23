// src/App.jsx
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  BrowserRouter
} from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

import { StartPage } from "./pages/StartPage";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { ChangePassword } from "./pages/ChangePassword";
import { Profile } from "./pages/Profile";
import { Dialogs } from "./pages/Dialogs";
import { Dialog } from "./pages/Dialog";
import { PromptBuilder } from "./pages/PromptBuilder";
import { About } from "./pages/About";

// Компонент для защиты маршрутов
const ProtectedRoute = ({ children, user, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    toast.error("Сначала войдите в аккаунт");
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Главный компонент приложения
function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processedTokens, setProcessedTokens] = useState(new Set());

  // Автологин при загрузке
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (userStr && token) {
      try {
        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);
      } catch (err) {
        console.error("Ошибка localStorage:", err);
        localStorage.clear();
      }
    }
    setIsLoading(false);
  }, []);

  // Логин
  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
    toast.success(`С возвращением, ${userData.username || "друг"}!`);
  };

  // Логаут
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Вы вышли из аккаунта");
  };

  // Общие пропсы для страниц
  const pageProps = {
    user,
    setUser,
    onLogin: login,
    onLogout: logout,
    processedTokens,
    setProcessedTokens
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} onLogout={logout} />
        
        <main className="flex-1 bg-gray-50">
          <Routes>
            {/* Публичные маршруты */}
            <Route path="/" element={<StartPage {...pageProps} />} />
            <Route path="/login" element={<Login {...pageProps} />} />
            <Route path="/register" element={<Register {...pageProps} />} />
            <Route path="/forgot-password" element={<ForgotPassword {...pageProps} />} />
            <Route path="/reset-password" element={<ResetPassword {...pageProps} />} />
            <Route path="/about" element={<About {...pageProps} />} />

            {/* Защищённые маршруты */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute user={user} isLoading={isLoading}>
                  <Profile {...pageProps} />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/dialogs" 
              element={
                <ProtectedRoute user={user} isLoading={isLoading}>
                  <Dialogs {...pageProps} />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/dialog/:id?" 
              element={
                <ProtectedRoute user={user} isLoading={isLoading}>
                  <Dialog {...pageProps} />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/builder" 
              element={
                <ProtectedRoute user={user} isLoading={isLoading}>
                  <PromptBuilder {...pageProps} />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/change-password" 
              element={
                <ProtectedRoute user={user} isLoading={isLoading}>
                  <ChangePassword {...pageProps} />
                </ProtectedRoute>
              } 
            />

            {/* Перенаправления */}
            <Route path="/landing" element={<Navigate to="/" replace />} />
            <Route path="/start" element={<Navigate to="/" replace />} />
            <Route path="/auth" element={<Navigate to="/login" replace />} />
            
            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
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
    </BrowserRouter>
  );
}

export default App;