// src/pages/Profile.jsx -> мертвый, вы сюда не попадете
import { useState } from "react";
import { Button } from "../components/ui/button";
import { format } from "date-fns";
import toast from "react-hot-toast";

export function Profile({ user, setPage, setUser }) {
    const [submitting, setSubmitting] = useState(false);

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
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setUser(null);
            setPage("landing");
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
    <div className="max-w-md mx-auto mt-20 p-6  rounded-lg shadow-sm">
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
          <p className="font-medium">{format(new Date(user.createdAt), "dd.MM.yyyy")}</p>
        </div>
      </div>
      <div className="mt-8 space-y-3">
        <Button variant="outline" className="w-full" onClick={() => setPage("change-password")}>
          Сменить пароль
        </Button>
        <Button
          variant="outline"
          className="w-full text-red-600"
          onClick={() => handleLogout()}
        >
          Выйти
        </Button>
      </div>
    </div>
  );
}