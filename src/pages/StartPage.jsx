// src/pages/StartPage.jsx
import { Button } from "../components/ui/button";
import { ArrowRight, BookOpen, Zap, LayoutTemplate, History } from "lucide-react";
import { useEffect } from "react";

export function StartPage({ setPage, user }) {
  useEffect(() => {
    if (user) {
      setPage("builder");
    }
  }, [user, setPage]);

  if (user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black pt-20 px-4 pb-16">
      <div className="max-w-4xl mx-auto text-center">

        {/* Заголовок — компактнее */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
          <span className="text-gray-900 dark:text-white">Создавайте</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            идеальные промты
          </span>
          <br />
          <span className="text-gray-900 dark:text-white">за минуты</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Конструктор с ИИ-подсказками, шаблонами и сохранением истории
        </p>

        {/* Кнопки — меньше и аккуратнее */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => setPage("register")}
            className="h-12 px-8 text-base font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md hover:shadow-lg transition-all"
          >
            Начать бесплатно
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => setPage("guide")}
            className="h-12 px-8 text-base font-medium border-2 dark:text-white border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <BookOpen className="mr-2 w-4 h-4" />
            Руководство
          </Button>
        </div>

        {/* Преимущества — компактные карточки */}
        <div className="mt-20 grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="group">
            <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              ИИ-подсказки
            </h3>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Умные советы прямо во время написания
            </p>
          </div>

          <div className="group">
            <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
              <LayoutTemplate className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              Готовые шаблоны
            </h3>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Лучшие структуры от экспертов
            </p>
          </div>

          <div className="group">
            <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
              <History className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              История запросов
            </h3>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Все промты сохраняются автоматически
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}