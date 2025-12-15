// src/pages/Register.jsx
import toast from "react-hot-toast";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Eye, EyeOff, User, Mail, Lock, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export function Register({ setPage }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const checks = {
    name: form.name.trim().length >= 2 && /^[A-Za-z\s]+$/.test(form.name.trim()),
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()),
    length: form.password.length >= 6,
    letter: /[A-Za-z]/.test(form.password),
    number: /\d/.test(form.password),
    special: /[@$!%*#?&]/.test(form.password),
    match: form.password && form.password === form.confirm,
  };

  const allValid = Object.values(checks).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allValid) return toast.error("Проверьте все поля");

    setSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.name.trim(),
          email: form.email.toLowerCase().trim(),
          password: form.password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Аккаунт создан! Подтвердите электронную почту");
        setTimeout(() => setPage("login"), 1500);
      } else {
        toast.error(data.message || "Ошибка");
      }
    } catch {
      toast.error("Нет связи с сервером");
    }
  setSubmitting(false);
};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 px-4 transition-colors duration-300">
      <div className="max-w-md mx-auto py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Регистрация
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Имя */}
          <div className="relative">
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Имя"
              className="h-12 text-lg pl-12 pr-4 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white transition-all"
              disabled={submitting}
            />
            {checks.name ? (
              <CheckCircle2 className="absolute left-3.5 top-3.5 h-5 w-5 text-green-500" />
            ) : (
              <User className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              className="h-12 text-lg pl-12 pr-4 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white transition-all"
              disabled={submitting}
            />
            {checks.email ? (
              <CheckCircle2 className="absolute left-3.5 top-3.5 h-5 w-5 text-green-500" />
            ) : (
              <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
            )}
          </div>

          {/* Пароль */}
          <div className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Пароль"
                className="h-12 text-lg pl-12 pr-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white transition-all"
                disabled={submitting}
              />
              {/* Галочка слева — появляется, когда пароль введён */}
            {checks.length && checks.letter && checks.number && checks.special ? (
              <CheckCircle2 className="absolute left-3.5 top-3.5 h-5 w-5 text-green-500 transition-all duration-200" />
            ) : (
              <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
            )}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Поэтапная проверка пароля */}
            <div className="space-y-2 text-sm">
              <div className={`flex items-center gap-3 ${checks.length ? "text-green-500" : "text-gray-500 dark:text-gray-400"}`}>
                {checks.length ? <CheckCircle2 className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border-2 border-current" />}
                <span className="font-medium">Минимум 6 символов</span>
              </div>
              <div className={`flex items-center gap-3 ${checks.letter ? "text-green-500" : "text-gray-500 dark:text-gray-400"}`}>
                {checks.letter ? <CheckCircle2 className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border-2 border-current" />}
                <span className="font-medium">Хотя бы одна буква</span>
              </div>
              <div className={`flex items-center gap-3 ${checks.number ? "text-green-500" : "text-gray-500 dark:text-gray-400"}`}>
                {checks.number ? <CheckCircle2 className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border-2 border-current" />}
                <span className="font-medium">Хотя бы одна цифра</span>
              </div>
              <div className={`flex items-center gap-3 ${checks.special ? "text-green-500" : "text-gray-500 dark:text-gray-400"}`}>
                {checks.special ? <CheckCircle2 className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border-2 border-current" />}
                <span className="font-medium">Спецсимвол (@$!%*#?&)</span>
              </div>
            </div>
          </div>

          {/* Подтверждение пароля */}
          <div className="relative">
            <Input
              type={showConfirm ? "text" : "password"}
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              placeholder="Повторите пароль"
              className="h-12 text-lg pl-12 pr-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white transition-all"
              disabled={submitting}
            />
            {checks.match ? (
              <CheckCircle2 className="absolute left-3.5 top-3.5 h-5 w-5 text-green-500" />
            ) : (
              <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
            )}
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-3.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Кнопка */}
          <Button
            type="submit"
            disabled={submitting || !allValid}
            className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 transition-all"
          >
            {submitting ? "Создаём аккаунт..." : "Создать аккаунт"}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <span className="text-gray-600 dark:text-gray-400">Уже есть аккаунт? </span>
          <button
            onClick={() => setPage("login")}
            className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            Войти
          </button>
        </div>
      </div>
    </div>
  )};