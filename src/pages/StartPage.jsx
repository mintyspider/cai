// src/pages/StartPage.jsx -> нет перенаправления в профиль
import { Button } from "../components/ui/button";
import { ArrowRight, Sparkles, BookOpen } from "lucide-react";

export function StartPage({ setPage }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24 sm:py-24 text-center">
      <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
        Создавайте идеальные промты<br></br>
        <span className="text-blue-600"> за минуты</span>
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
        Конструктор промтов с ИИ-подсказками, шаблонами и историей запросов.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
        <Button size="lg" variant="outline" onClick={() => setPage("register")} className="gap-2">
          Начать бесплатно
          <ArrowRight className="w-5 h-5" />
        </Button>
        <Button size="lg" variant="outline" onClick={() => setPage("guide")} className="gap-2">
          <BookOpen className="w-5 h-5" />
          Руководство
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div>
          <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <h3 className="font-semibold mb-1">ИИ-подсказки</h3>
          <p className="text-sm text-gray-600">Умные советы по формулировкам</p>
        </div>
        <div>
          <div className="w-12 h-12 bg-blue-50 rounded-lg mx-auto mb-3 flex items-center justify-center text-2xl">
            📋
          </div>
          <h3 className="font-semibold mb-1">Шаблоны</h3>
          <p className="text-sm text-gray-600">Готовые структуры промтов</p>
        </div>
        <div>
          <div className="w-12 h-12 bg-blue-50 rounded-lg mx-auto mb-3 flex items-center justify-center text-2xl">
            💾
          </div>
          <h3 className="font-semibold mb-1">История</h3>
          <p className="text-sm text-gray-600">Все промты в одном месте</p>
        </div>
      </div>
    </div>
  );
}