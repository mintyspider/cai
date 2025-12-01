// src/pages/Profile.jsx -> мертвый, вы сюда не попадете
import { Button } from "../components/ui/button";
import { format } from "date-fns";

export function Profile({ user, setPage, setUser }) {
  return (
    <div className="max-w-md mx-auto mt-20 p-6  rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Профиль</h2>
      <div className="space-y-4 text-gray-700">
        <div>
          <p className="text-sm text-gray-500">Имя</p>
          <p className="font-medium">{user.name}</p>
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
          onClick={() => {
            setUser(null);
            setPage("landing");
          }}
        >
          Выйти
        </Button>
      </div>
    </div>
  );
}