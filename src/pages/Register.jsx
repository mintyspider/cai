// src/pages/Register.jsx -> рабочий
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useState } from "react";

export function Register({ setPage }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return alert("Пароли не совпадают");

    fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPage("login");
      });
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6  rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-center mb-6">Регистрация</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Имя</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div>
          <Label>Пароль</Label>
          <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        <div>
          <Label>Подтверждение</Label>
          <Input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} required />
        </div>
        <Button type="submit" className="btn-primary w-full">Создать аккаунт</Button>
      </form>
      <p className="mt-6 text-center text-sm">
        Уже есть аккаунт?{" "}
        <button onClick={() => setPage("login")} className="text-blue-600">Войти</button>
      </p>
    </div>
  );
}