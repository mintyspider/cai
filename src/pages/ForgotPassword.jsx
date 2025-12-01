// src/pages/ForgotPassword.jsx -> рабочий
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useState } from "react";

export function ForgotPassword({ setPage }) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/api/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }).then(() => alert("Письмо отправлено!"));
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6  rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-center mb-6">Восстановление пароля</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full hover:btn-primary">Отправить письмо</Button>
      </form>
      <p className="mt-6 text-center text-sm">
        <button onClick={() => setPage("login")} className="text-blue-600">← Назад ко входу</button>
      </p>
    </div>
  );
}