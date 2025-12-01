// Dialogs.jsx -> мертвый
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { Clock, MessageSquare } from "lucide-react";

const prompts = [
  { id: 1, name: "Анализ конкурентов", createdAt: new Date("2025-11-05T10:30:00") },
  { id: 2, name: "SEO-оптимизация", createdAt: new Date("2025-11-04T15:20:00") },
];

export function SavedPrompts({ setPage }) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Диалоги созданные</h1>
      <div className="space-y-4">
        {prompts.map((p) => (
          <div
            key={p.id}
            onClick={() => setPage("dialog")}
            className="p-4  rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer flex justify-between items-center"
          >
            <div>
              <h3 className="font-medium">{p.name}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(p.createdAt, { addSuffix: true, locale: ru })}
              </p>
            </div>
            <MessageSquare className="w-5 h-5 text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  );
}