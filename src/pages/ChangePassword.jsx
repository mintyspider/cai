// src/pages/ChangePassword.jsx
import toast from "react-hot-toast";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useState } from "react";

export function ChangePassword({ setPage, user }) {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPass !== confirm) {
      toast("Пароли не совпадают");
      return;
    }

    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: newPass,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast(data.message || "Ошибка при смене пароля");
        return;
      }

      toast("Пароль успешно изменён 🎉");
      setPage("profile");

    } catch (err) {
      console.error(err);
      toast("Ошибка сервера. Попробуйте позже.");
    }
  };


  return (
    <div className="max-w-md mx-auto mt-20 p-6  rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-center mb-6">Смена пароля</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Старый пароль</Label>
          <Input type="password" value={oldPass} onChange={(e) => setOldPass(e.target.value)} required />
        </div>
        <div>
          <Label>Новый пароль</Label>
          <Input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} required />
        </div>
        <div>
          <Label>Повторите новый пароль</Label>
          <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full btn-primary">Сменить</Button>
      </form>
      <p className="mt-6 text-center text-sm">
        <button onClick={() => setPage("profile")} className="text-blue-600">← Назад</button>
      </p>
    </div>
  );
}