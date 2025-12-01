// src/pages/ResetPassword.jsx -> полудохлый
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useState } from "react";

export function ResetPassword({ setPage }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const token = '123';

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (password !== confirm) {
    alert("Пароли не совпадают");
    return;
  }

  try {
    const res = await fetch(`/api/reset-password?token=${token/*Здесь должен быть токен*/}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.message || "Ошибка при сбросе пароля");
      return;
    }

    alert("Пароль успешно изменён! 🎉");
    setPage("login");

  } catch (err) {
    console.error(err);
    alert("Ошибка сервера. Попробуйте позже.");
  }
};

  return (
    <div className="max-w-md mx-auto mt-20 p-6  rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-center mb-6">Сброс пароля</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Новый пароль</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <Label>Повторите пароль</Label>
          <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full btn-primary">Сохранить</Button>
      </form>
      <p className="mt-6 text-center text-sm">
        <button onClick={() => setPage("login")} className="text-blue-600">← Назад ко входу</button>
      </p>
    </div>
  );
}