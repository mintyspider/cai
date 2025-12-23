// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Eye, EyeOff, Mail, Lock, CheckCircle2 } from "lucide-react";

export function Login({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifyingToken, setVerifyingToken] = useState(false);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPasswordFilled = password.length > 0;

  // Проверяем location state на наличие данных о подтверждении email
  useEffect(() => {
    if (location.state?.emailVerified) {
      setEmailVerified(true);
      if (location.state?.email) {
        setEmail(location.state.email);
      }
      // Также проверяем localStorage
      const verifiedEmail = localStorage.getItem("verifiedEmail");
      if (verifiedEmail && verifiedEmail === location.state.email) {
        console.log("Email подтвержден через localStorage");
      }
    }
  }, [location.state]);

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
        navigate("/profile");
        toast.success(`Добро пожаловать, ${data.data.user.username}!`);
      } else {
        // Проверяем, нужно ли подтвердить email
        if (data.code === "EMAIL_NOT_VERIFIED") {
          toast.error("Подтвердите email перед входом. Проверьте свою почту.");
        } else {
          toast.error(data.message || "Неверный email или пароль");
        }
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
            Вход в аккаунт
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Введите ваши данные для входа
          </p>
        </div>

        {/* Индикатор проверки токена */}
        {verifyingToken && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
            <p className="text-blue-600 dark:text-blue-400 font-medium">
              Проверка ссылки подтверждения...
            </p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Уведомление о подтверждении email */}
          {emailVerified && !verifyingToken && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-400">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Email успешно подтверждён!</span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-500 mt-1 text-center">
                Теперь вы можете войти в аккаунт
              </p>
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
              disabled={submitting || verifyingToken}
              required
            />
            {isValidEmail ? (
              <CheckCircle2 className="absolute left-3.5 top-3.5 h-5 w-5 text-green-500 transition-all duration-200" />
            ) : (
              <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
            )}
          </div>

          {/* Пароль */}
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              className="h-12 text-lg pl-12 pr-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white transition-all"
              disabled={submitting || verifyingToken}
              required
            />
            {isPasswordFilled ? (
              <CheckCircle2 className="absolute left-3.5 top-3.5 h-5 w-5 text-green-500 transition-all duration-200" />
            ) : (
              <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
            )}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              disabled={submitting || verifyingToken}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Забыли пароль? */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
            >
              Забыли пароль?
            </Link>
          </div>

          {/* Кнопка входа */}
          <Button
            type="submit"
            disabled={submitting || verifyingToken || !isValidEmail || !isPasswordFilled}
            className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 transition-all"
          >
            {submitting ? "Входим..." : verifyingToken ? "Проверяем..." : "Войти"}
          </Button>
        </form>

        <div className="mt-8 space-y-4 text-center">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Нет аккаунта? </span>
            <Link
              to="/register"
              className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
            >
              Зарегистрироваться
            </Link>
          </div>
          
          <div>
            <Link
              to="/"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm hover:underline transition-colors"
            >
              Вернуться на главную
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}