// src/pages/Favorites.jsx
import { Heart, Edit2, Trash2 } from "lucide-react";

export function Favorites() {
  const mockFavorites = [
    {
      id: 1,
      title: "Анализ конкурентов в SaaS",
      description:
        "Мы разрабатываем CRM с ИИ-ассистентом для малого бизнеса в России. "
        + "Задача: проанализируй 3 основных конкурента — AmoCRM, Битрикс24, RetailCRM "
        + "по критериям: функционал, цена, UX, отзывы.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <Heart className="w-7 h-7 text-red-500 fill-red-500" />
        Коллекция промтов
      </h1>

      {mockFavorites.length === 0 ? (
        <div className="p-12 rounded-lg shadow-lg text-center bg-gray-50 dark:bg-gray-800">
          <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">Пока нет избранных промтов</p>
          <p className="text-sm text-gray-400 mt-1">
            Нажмите на сердечко в списке запросов
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {mockFavorites.map((item, index) => (
            <div
              key={item.id}
              className="relative p-6 rounded-xl shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-gray-700 dark:to-gray-800 overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              {/* Overlay с кнопками */}
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 rounded-xl flex justify-end items-start p-4 gap-2 opacity-0 hover:opacity-100">
                <button className="p-1 rounded-full bg-white dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <Edit2 className="w-5 h-5 text-gray-600 dark:text-gray-200" />
                </button>
                <button className="p-1 rounded-full bg-white dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>

              {/* Иконка сердца */}
              <div className="absolute top-4 right-4 cursor-pointer">
                <Heart className="w-6 h-6 text-red-500 hover:scale-110 transition-transform duration-200" />
              </div>

              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                {item.title}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-base">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
