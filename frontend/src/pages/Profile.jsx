// src/pages/Profile.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { format } from "date-fns";
import toast from "react-hot-toast";

export function Profile({ user, setUser, onLogout }) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "Не указана";
    return format(new Date(dateString), "dd.MM.yyyy");
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id
        }),
      });

      const data = await res.json();

      if (data.success) {
        onLogout();
        navigate("/");
        toast.success("Вы вышли из аккаунта");
      } else {
        toast.error(data.message || "Возникла ошибка при выходе");
      }
    } catch {
      toast.error("Нет связи с сервером");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Профиль</h2>
      <div className="space-y-4 text-gray-700">
        <div>
          <p className="text-sm text-gray-500">Имя</p>
          <p className="font-medium">{user.username}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Дата регистрации</p>
          <p className="font-medium">{formatDate(user.createdAt)}</p>
        </div>
      </div>
      <div className="mt-8 space-y-3">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => navigate("/change-password")}
        >
          Сменить пароль
        </Button>
        <Button
          variant="outline"
          className="w-full text-red-600"
          onClick={handleLogout}
          disabled={submitting}
        >
          {submitting ? "Выход..." : "Выйти"}
        </Button>
      </div>
    </div>
  );
}