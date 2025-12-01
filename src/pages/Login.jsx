// Login.jsx -> рабочий
import { useState } from "react";

export function Login({ setUser, setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setPage("profile");
      } else {
        setError("Неверный логин или пароль 😢");
      }
    } catch {
      setError("Ошибка сервера. Попробуйте позже.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center mb-2">Вход</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="input-base"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          className="input-base"
        />

        <button type="submit" className="btn-primary w-full">
          Войти
        </button>

        <p className="text-sm text-center text-gray-500">
          Нет аккаунта?{" "}
          <button
            type="button"
            onClick={() => setPage("register")}
            className="text-blue-600 hover:underline"
          >
            Зарегистрироваться
          </button>
        </p>
          <p className="text-sm text-center text-gray-500">
          Забыли пароль?{" "}
          <button
            type="button"
            onClick={() => setPage("reset")}
            className="text-blue-600 hover:underline"
          >
            Восстановить
          </button>
        </p>
      </form>
    </div>
  );
}
