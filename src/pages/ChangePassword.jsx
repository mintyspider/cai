// src/pages/ChangePassword.jsx
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useState } from "react";
import { ArrowLeft, Key, Lock, Shield } from "lucide-react";

export function ChangePassword({ user }) {
  const navigate = useNavigate();
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPass !== confirm) {
      toast.error("Пароли не совпадают");
      return;
    }

    if (newPass.length < 6) {
      toast.error("Пароль должен содержать минимум 6 символов");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          old_password: oldPass,
          password: newPass,
          user_id: user?.user_id
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Ошибка при смене пароля");
        return;
      }

      toast.success("Пароль успешно изменён 🎉");
      navigate("/profile");
      
      // Очистка полей
      setOldPass("");
      setNewPass("");
      setConfirm("");

    } catch (err) {
      console.error(err);
      toast.error("Ошибка сервера. Попробуйте позже.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1); // Или navigate("/profile") для прямого перехода
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 px-4 transition-colors duration-300">
      <div className="max-w-md mx-auto py-12">
        {/* Кнопка назад */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Назад
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          {/* Заголовок с иконкой */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-4">
              <Key className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Смена пароля
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Введите текущий и новый пароль
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Старый пароль */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Lock className="w-4 h-4" />
                Текущий пароль
              </Label>
              <Input 
                type="password" 
                value={oldPass} 
                onChange={(e) => setOldPass(e.target.value)} 
                placeholder="Введите текущий пароль"
                className="h-12 text-lg"
                required 
                disabled={submitting}
              />
            </div>

            {/* Новый пароль */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Shield className="w-4 h-4" />
                Новый пароль
              </Label>
              <Input 
                type="password" 
                value={newPass} 
                onChange={(e) => setNewPass(e.target.value)} 
                placeholder="Введите новый пароль"
                className="h-12 text-lg"
                required 
                disabled={submitting}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Минимум 6 символов
              </p>
            </div>

            {/* Подтверждение */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Lock className="w-4 h-4" />
                Подтвердите пароль
              </Label>
              <Input 
                type="password" 
                value={confirm} 
                onChange={(e) => setConfirm(e.target.value)} 
                placeholder="Повторите новый пароль"
                className="h-12 text-lg"
                required 
                disabled={submitting}
              />
              {newPass && confirm && newPass === confirm && (
                <p className="text-xs text-green-600 dark:text-green-400">
                  ✓ Пароли совпадают
                </p>
              )}
            </div>

            {/* Кнопка */}
            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 transition-all"
              disabled={submitting || !oldPass || !newPass || !confirm}
            >
              {submitting ? "Меняем пароль..." : "Сменить пароль"}
            </Button>
          </form>

          {/* Дополнительные ссылки */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3 text-center">
            <button
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
            >
              Забыли пароль?
            </button>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <button
                onClick={() => navigate("/profile")}
                className="hover:text-gray-700 dark:hover:text-gray-300"
              >
                Вернуться в профиль
              </button>
            </div>
          </div>
        </div>

        {/* Безопасность */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
            <strong>Совет по безопасности:</strong> Используйте уникальный пароль, 
            который вы не применяете на других сайтах.
          </p>
        </div>
      </div>
    </div>
  );
}