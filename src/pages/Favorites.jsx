// src/pages/Favorites.jsx -> катастрофически мертвый
import { Heart } from "lucide-react";

export function Favorites() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Heart className="w-6 h-6 text-red-500 fill-red-500" />
        Коллекция
      </h1>
      <div className=" p-12 rounded-lg shadow-sm text-center">
        <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500">Пока нет избранных промтов</p>
        <p className="text-sm text-gray-400 mt-1">
          Нажмите на сердечко в списке запросов
        </p>
      </div>
    </div>
  );
}