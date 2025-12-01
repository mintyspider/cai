// src/pages/PromptBuilder.jsx -> дохлый
import { useState, useRef } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Plus, Trash, Copy, ArrowRight, Sparkles, Loader2 } from "lucide-react";

const blockTypes = [
  { value: "context", label: "Контекст", placeholder: "Опишите контекст задачи..." },
  { value: "task", label: "Задача", placeholder: "Твоя задача — ..." },
  { value: "role", label: "Роль", placeholder: "Ты — эксперт в..." },
  { value: "constraints", label: "Ограничения", placeholder: "Учитывай следующие ограничения:..." },
  { value: "examples", label: "Примеры", placeholder: "Например:..." }
];

const availableBlockTypes = blockTypes.filter(type => type.value !== "context" && type.value !== "task");

// Заглушка ИИ
const generateAIResponse = async (prompt, taskContent) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return `Спасибо за ваш запрос! Я сосредоточился на задаче: "${taskContent.substring(0, 100)}..."

**Анализ задачи**:
- Ваша задача: ${taskContent}
- Фокус: Выполнение с учетом контекста и ограничений.

**Рекомендации**:
1. Разбейте задачу на шаги.
2. Убедитесь в соответствии требованиям.
3. Проверьте результат.

**Решение**:
- Шаг 1: Определите ключевые элементы.
- Шаг 2: Разработайте план.
- Шаг 3: Реализуйте и протестируйте.
- Шаг 4: Оптимизируйте.

Готов помочь дальше!`;
};

export function PromptBuilder({ setPage }) {
  const [blocks, setBlocks] = useState([
    {
      id: "1",
      type: "context",
      content: "Мы разрабатываем CRM с ИИ-ассистентом для малого бизнеса в России.",
      label: "Контекст"
    },
    {
      id: "2",
      type: "task",
      content: "Проанализируй 3 основных конкурента: AmoCRM, Битрикс24, RetailCRM по критериям: функционал, цена, UX, отзывы.",
      label: "Задача"
    }
  ]);
  const [promptName, setPromptName] = useState("Анализ конкурентов в SaaS");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const textareaRefs = useRef({});

  const getUsedBlockTypes = () => blocks.map(b => b.type);

  const addBlock = () => {
    const used = getUsedBlockTypes();
    const available = availableBlockTypes.find(t => !used.includes(t.value));
    if (!available) return;
    const newBlock = {
      id: Date.now().toString(),
      type: available.value,
      content: "",
      label: available.label
    };
    setBlocks([...blocks, newBlock]);
    setTimeout(() => {
      const el = textareaRefs.current[newBlock.id];
      if (el) el.focus();
    }, 0);
  };

  const removeBlock = (id) => {
    setBlocks(blocks.filter(b => b.id !== id));
    delete textareaRefs.current[id];
  };

  const updateBlock = (id, field, value) => {
    setBlocks(blocks.map(b => {
      if (b.id === id) {
        if (field === "type") {
          const type = blockTypes.find(t => t.value === value);
          if (type) return { ...b, type: type.value, label: type.label, content: "" };
        }
        return { ...b, [field]: value };
      }
      return b;
    }));
  };

  const generatePrompt = () => {
    const parts = blocks
      .filter(b => b.content.trim())
      .map(b => `## ${b.label}\n${b.content}`);
    return `# ${promptName || "Мой промт"}\n\n${parts.join("\n\n")}\n\nНачните работу!`;
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(generatePrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyResponse = () => {
    navigator.clipboard.writeText(aiResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGetResult = async () => {
    const prompt = generatePrompt();
    const task = blocks.find(b => b.type === "task")?.content || "Задача не указана";
    if (!prompt.trim()) return;

    setIsLoading(true);
    setShowResponse(true);
    setShowTips(false);
    setAiResponse("");

    try {
      const res = await generateAIResponse(prompt, task);
      setAiResponse(res);
    } catch {
      setAiResponse("Ошибка при получении ответа.");
    } finally {
      setIsLoading(false);
    }
  };

  const finalPrompt = generatePrompt();

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">Конструктор промтов</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Конструктор */}
        <div className="space-y-6">
          <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            {blocks.map((block, i) => (
              <Card key={block.id} className="p-4 space-y-1 border">
                <div className="flex justify-between items-center">
                  <span className="text-xs border px-2 py-0.5 rounded">Блок {i + 1}</span>
                  {blocks.length > 2 && i > 1 && (
                    <Button size="sm" variant="ghost" onClick={() => removeBlock(block.id)}>
                      <Trash className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Тип блока</label>
                  <select
                    className="h-9 w-full rounded-md border  px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    value={block.type}
                    onChange={(e) => updateBlock(block.id, "type", e.target.value)}
                    disabled={i < 2}
                  >
                    {(i < 2 ? blockTypes.filter(t => t.value === block.type) : availableBlockTypes).map(t => (
                      <option
                        key={t.value}
                        value={t.value}
                        disabled={getUsedBlockTypes().includes(t.value) && block.type !== t.value}
                      >
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Содержание</label>
                  <textarea
                    ref={el => el && (textareaRefs.current[block.id] = el)}
                    className="min-h-[120px] w-full rounded-md border  px-3 py-2 text-base placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder={blockTypes.find(t => t.value === block.type)?.placeholder}
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, "content", e.target.value)}
                    rows={6}
                  />
                </div>
              </Card>
            ))}

            {getUsedBlockTypes().length < blockTypes.length && (
              <Button onClick={addBlock} variant="outline" className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Добавить блок
              </Button>
            )}
          </div>
        </div>

        {/* Предпросмотр и ответ */}
        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <Card className="p-4">
            <label className="text-sm font-medium">Название промта</label>
            <input
              className="h-9 w-full rounded-md border  px-3 py-1 text-base placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 mt-1"
              placeholder="Мой промт..."
              value={promptName}
              onChange={(e) => setPromptName(e.target.value)}
            />
          </Card>

          <Card className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Предпросмотр</h3>
              <Button size="sm" variant="outline" onClick={copyPrompt} className="gap-2">
                <Copy className="w-4 h-4" />
                {copied ? "Скопировано!" : "Копировать"}
              </Button>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg min-h-[100px] max-h-[350px] overflow-y-auto">
              {finalPrompt ? (
                <pre className="text-sm font-mono whitespace-pre-wrap">{finalPrompt}</pre>
              ) : (
                <p className="text-gray-400 text-sm">Заполните блоки...</p>
              )}
            </div>
            {finalPrompt && (
              <Button className="w-full text-blue-500 mt-3 gap-2" size="lg" onClick={handleGetResult} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Получение...
                  </>
                ) : (
                  <>
                    Получить результат
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            )}
          </Card>

          {showResponse && (
            <Card className="p-4 border-2 border-blue-500/20">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium">Ответ ИИ</h3>
                </div>
                {aiResponse && (
                  <Button size="sm" variant="outline" onClick={copyResponse} className="gap-2">
                    <Copy className="w-4 h-4" />
                    Копировать
                  </Button>
                )}
              </div>
              <div className="bg-gray-100 p-4 rounded-lg min-h-[100px]">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <Sparkles className="w-8 h-8 text-blue-600 animate-spin" />
                    <p className="text-sm text-gray-500">ИИ думает...</p>
                  </div>
                ) : (
                  <pre className="text-sm whitespace-pre-wrap">{aiResponse}</pre>
                )}
              </div>
            </Card>
          )}

          {showTips && (
            <Card className="p-4 bg-blue-50">
              <h4 className="font-medium mb-2">Советы</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Определите роль ИИ</li>
                <li>• Чётко опишите задачу</li>
                <li>• Добавьте примеры</li>
                <li>• Укажите ограничения</li>
                <li>• Проверьте промт</li>
              </ul>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}