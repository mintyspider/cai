// Dialog.jsx -> мертвый
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Copy, ArrowLeft, Clock, Tag, Pencil, Plus } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import toast from "react-hot-toast";

export function Dialog({ setPage, dialogId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    toast("Скопировано!");
  };

  const openConstructor = (type, id) => {
    setPage("constructor", { type, id });
  };

  // 🔥 ЗАГРУЗКА ДИАЛОГА С СЕРВЕРА
  useEffect(() => {
    fetch(`/api/dialog/${dialogId}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        toast("Ошибка загрузки данных");
        setLoading(false);
      });
  }, [dialogId]);

  if (loading) return <p className="p-6">Загрузка...</p>;
  if (!data) return <p className="p-6">Данные не найдены</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">

      <button
        onClick={() => setPage("saved")}
        className="flex items-center gap-1 text-blue-600 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Назад
      </button>

      <div>
        <h1 className="text-3xl font-bold">{data.name}</h1>

        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {format(new Date(data.createdAt), "d MMMM yyyy, HH:mm", { locale: ru })}
          </span>

          <div className="flex gap-1">
            {data.tags.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs flex items-center gap-1"
              >
                <Tag className="w-3 h-3" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 🔥 ЦИКЛ ПРОМТОВ И ОТВЕТОВ */}
      {data.dialogs.map((d) => (
        <div key={d.id} className="space-y-6 border-b border-gray-200 pb-6">

          {/* PROMPT */}
          <div className="p-6 rounded-lg shadow-sm bg-white dark:bg-gray-800">
            <div className="flex justify-between mb-3 items-center">
              <h3 className="font-semibold">Промт</h3>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => openConstructor("prompt", d.id)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>

                <Button size="sm" variant="ghost" onClick={() => copy(d.prompt)}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <pre className="bg-gray-50 p-4 rounded text-sm font-mono whitespace-pre-wrap">
              {d.prompt}
            </pre>
          </div>

          {/* RESPONSE */}
          <div className="p-6 rounded-lg shadow-sm border-l-4 border-blue-600 bg-white dark:bg-gray-800">
            <div className="flex justify-between mb-3 items-center">
              <h3 className="font-semibold">Ответ ИИ</h3>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => openConstructor("response", d.id)}
                >
                  <Plus className="w-4 h-4" />
                </Button>

                <Button size="sm" variant="ghost" onClick={() => copy(d.response)}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <pre className="bg-gray-50 p-4 rounded text-sm whitespace-pre-wrap">
              {d.response}
            </pre>
          </div>

        </div>
      ))}
    </div>
  );
}
