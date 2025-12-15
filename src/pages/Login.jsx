// src/pages/Login.jsx
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Eye, EyeOff, Mail, Lock, CheckCircle2 } from "lucide-react";

export function Login({ setPage, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  // Проверки в реальном времени
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPasswordFilled = password.length > 0;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      setPage("login");

      fetch(`/api/login?token=${token}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setStatus("Email успешно подтверждён! Теперь войдите");
            toast.success("Email подтверждён");
            if (data.email) setEmail(data.email);
          } else {
            toast.error(data.error || "Ссылка недействительна");
          }
        })
        .catch(() => toast.error("Ошибка сервера"));

      window.history.replaceState({}, "", "/login");
    }
  }, [setPage]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        onLogin(data.data.user, data.data.token);
      } else {
        toast.error(data.message || "Неверный email или пароль");
      }
    } catch {
      toast.error("Нет связи с сервером");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black pt-16 px-4 transition-colors duration-300">
      <div className="max-w-md mx-auto py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Вход
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Успешное подтверждение */}
          {status && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-center text-sm font-medium">
              {status}
            </div>
          )}

          {/* Email */}
          <div className="relative">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="h-12 text-lg pl-12 pr-4 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white transition-all"
              disabled={submitting}
              required
            />
            {isValidEmail ? (
              <CheckCircle2 className="absolute left-3.5 top-3.5 h-5 w-5 text-green-500 transition-all duration-200" />
            ) : (
              <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
            )}
          </div>

          {/* Пароль — теперь с галочкой! */}
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              className="h-12 text-lg pl-12 pr-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white transition-all"
              disabled={submitting}
              required
            />
            {/* Галочка слева — появляется, когда пароль введён */}
            {isPasswordFilled ? (
              <CheckCircle2 className="absolute left-3.5 top-3.5 h-5 w-5 text-green-500 transition-all duration-200" />
            ) : (
              <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
            )}
            {/* Глазик справа */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Кнопка */}
          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 transition-all"
          >
            {submitting ? "Входим..." : "Войти"}
          </Button>
        </form>

        <div className="mt-8 space-y-3 text-center text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Нет аккаунта? </span>
            <button
              onClick={() => setPage("register")}
              className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              Зарегистрироваться
            </button>
          </div>
          <div>
            <button
              onClick={() => setPage("forgot")}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              Забыли пароль?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}