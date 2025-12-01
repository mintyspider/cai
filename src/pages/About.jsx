// src/pages/About.jsx
export function About({ setPage }) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">О нас</h1>
      
      <div className="prose prose-lg text-gray-700 space-y-6">
        <p>
          <strong>CAI</strong> — это конструктор промтов для работы с ИИ. 
          Мы помогаем копирайтерам, маркетологам, разработчикам и всем, кто использует нейросети, 
          создавать точные, эффективные и повторно используемые запросы.
        </p>

        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">Наша миссия</h3>
          <p>
            Сделать работу с ИИ проще, быстрее и предсказуемее. 
            Вместо хаотичных запросов — структурированные, сохранённые и улучшенные промты.
          </p>
        </div>

        <h3 className="font-semibold text-lg">Что мы предлагаем</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Конструктор с блоками: контекст, задача, роль, ограничения, примеры</li>
          <li>Предпросмотр промта в реальном времени</li>
          <li>Тестовая отправка в ИИ с мгновенным ответом</li>
          <li>Сохранение, Коллекция, история</li>
          <li>Советы и шаблоны для лучших результатов</li>
        </ul>

        <h3 className="font-semibold text-lg">Технологии</h3>
        <p>
          Frontend: <strong>React + Tailwind CSS</strong><br />
          Иконки: <strong>lucide-react</strong><br />
          Бэкенд: готов к интеграции с <strong>Yii2</strong> (REST API)
        </p>

        <div className="mt-8 p-6 bg-gray-100 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">Документация</h3>
          <p>
            Подробное руководство по созданию промтов, API и интеграции — 
            <a href="#" className="text-blue-600 hover:underline ml-1">в разделе «Руководство»</a>.
          </p>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          © 2025 CAI. Создано с заботой о ваших промтах.
        </p>
      </div>
    </div>
  );
}