// src/pages/PromptBuilder.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { 
  Plus, 
  Trash, 
  Copy, 
  ArrowRight, 
  Sparkles, 
  Loader2, 
  Save,
  MessageSquare,
  Settings,
  HelpCircle,
  Check,
  Download,
  FileText
} from "lucide-react";
import toast from "react-hot-toast";

const blockTypes = [
  { value: "context", label: "Контекст", placeholder: "Опишите контекст задачи...", required: true },
  { value: "task", label: "Задача", placeholder: "Твоя задача — ...", required: true },
  { value: "role", label: "Роль", placeholder: "Ты — эксперт в...", required: false },
  { value: "constraints", label: "Ограничения", placeholder: "Учитывай следующие ограничения:...", required: false },
  { value: "examples", label: "Примеры", placeholder: "Например:...", required: false },
  { value: "format", label: "Формат ответа", placeholder: "Предоставь ответ в виде:...", required: false }
];

export function PromptBuilder({ user }) {
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState([
    {
      id: "1",
      type: "context",
      content: "",
      label: "Контекст",
      required: true
    },
    {
      id: "2",
      type: "task",
      content: "",
      label: "Задача",
      required: true
    }
  ]);
  const [promptName, setPromptName] = useState("Мой промпт");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [temperature, setTemperature] = useState(0.7);
  const textareaRefs = useRef({});

  // Проверка авторизации
  useEffect(() => {
    if (!user) {
      toast.error("Требуется авторизация");
      navigate("/login");
    }
  }, [user, navigate]);

  const getUsedBlockTypes = () => blocks.map(b => b.type);
  const availableBlockTypes = blockTypes.filter(type => 
    !blocks.find(b => b.type === type.value) || type.required
  );

  const addBlock = () => {
    const used = getUsedBlockTypes();
    const available = blockTypes.find(t => !used.includes(t.value) && !t.required);
    if (!available) return;
    
    const newBlock = {
      id: Date.now().toString(),
      type: available.value,
      content: "",
      label: available.label,
      required: available.required
    };
    
    setBlocks([...blocks, newBlock]);
    setTimeout(() => {
      const el = textareaRefs.current[newBlock.id];
      if (el) el.focus();
    }, 0);
  };

  const removeBlock = (id) => {
    const blockToRemove = blocks.find(b => b.id === id);
    if (blockToRemove?.required) {
      toast.error("Нельзя удалить обязательный блок");
      return;
    }
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
    return `# ${promptName}\n\n${parts.join("\n\n")}\n\nНачните работу!`;
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(generatePrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyResponse = () => {
    navigator.clipboard.writeText(aiResponse);
    toast.success("Ответ скопирован");
  };

  const validatePrompt = (showErrors = false) => {
    const requiredBlocks = blocks.filter(b => b.required);
    const emptyRequired = requiredBlocks.filter(b => !b.content.trim());
    
    if (emptyRequired.length > 0 && showErrors) {
      const blockNames = emptyRequired.map(b => b.label).join(", ");
      toast.error(`Заполните обязательные блоки: ${blockNames}`);
      return false;
    }
    
    if (!promptName.trim() && showErrors) {
      toast.error("Введите название промпта");
      return false;
    }
    
    return emptyRequired.length === 0 && promptName.trim();
  };

  // Функция для экспорта в TXT файл
  const exportToTxt = () => {
    if (!validatePrompt() || !aiResponse) {
      toast.error("Сначала получите ответ от ИИ");
      return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const filename = `prompt_${promptName.replace(/\s+/g, '_')}_${timestamp}.txt`;
    
    const content = `========================================
ПРОМПТ И ОТВЕТ ИИ
Сгенерировано: ${new Date().toLocaleString()}
Модель: ${model}
Температура: ${temperature}
Название: ${promptName}
========================================

=================== ПРОМПТ ===================

${generatePrompt()}

=================== ОТВЕТ ИИ =================

${aiResponse}

========================================
Конец файла`;

    // Создаем Blob и скачиваем файл
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`Файл ${filename} скачан`);
  };

  // Функция для экспорта только промпта
  const exportPromptOnly = () => {
    if (!validatePrompt()) {
      toast.error("Заполните обязательные поля");
      return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const filename = `prompt_${promptName.replace(/\s+/g, '_')}_${timestamp}.txt`;
    
    const content = `========================================
ПРОМПТ ДЛЯ ИИ
Создан: ${new Date().toLocaleString()}
Название: ${promptName}
========================================

${generatePrompt()}

========================================
Конец файла`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`Промпт сохранен в ${filename}`);
  };

  const handleGetResult = async () => {
    if (!validatePrompt(true)) return;

    setIsLoading(true);
    setShowResponse(true);
    setShowTips(false);
    setAiResponse("");
    console.log(JSON.stringify({
          prompt: generatePrompt(),
          model,
          temperature,
          user_id: user?.user_id
        }))
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          prompt: generatePrompt(),
          model,
          temperature,
          user_id: user?.user_id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAiResponse(data.response);
        toast.success("Ответ получен!");
        
        // Автоматически сохраняем диалог
        saveToDialogs();
      } else {
        toast.error(data.message || "Ошибка генерации");
        setAiResponse("К сожалению, не удалось получить ответ. Попробуйте изменить промпт.");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Ошибка соединения с сервером");
      setAiResponse("Ошибка соединения. Проверьте подключение к интернету.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveToDialogs = async () => {
    console.log(JSON.stringify({
          title: promptName,
          prompt: generatePrompt(),
          response: aiResponse,
          user_id: user?.user_id}))
    try {
      await fetch("/api/dialogs/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          title: promptName,
          prompt: generatePrompt(),
          response: aiResponse,
          user_id: user?.user_id
        }),
      });
    } catch (error) {
      console.error("Failed to save dialog:", error);
    }
  };

  const finalPrompt = generatePrompt();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black pt-20 px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-8">
        {/* Хедер */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Конструктор промптов
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Создайте идеальный промпт для ИИ
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/dialogs")}
              className="gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Мои диалоги
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Левая колонка - Конструктор (стала уже) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Настройки модели */}
            <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Настройки модели</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Модель
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                  >
                    <option value="gpt-3.5-turbo">GigaChat</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Температура: {temperature}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Точный</span>
                    <span>Креативный</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Блоки промпта */}
            <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
              {blocks.map((block, i) => (
                <Card key={block.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        block.required 
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" 
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      }`}>
                        {block.label} {block.required && "*"}
                      </div>
                      <span className="text-xs text-gray-500">Блок {i + 1}</span>
                    </div>
                    
                    {!block.required && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeBlock(block.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 h-8 w-8 p-0"
                      >
                        <Trash className="w-3 h-3" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {!block.required && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Тип блока
                        </label>
                        <select
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
                          value={block.type}
                          onChange={(e) => updateBlock(block.id, "type", e.target.value)}
                        >
                          {blockTypes
                            .filter(t => !t.required)
                            .map(t => (
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
                    )}

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Содержание {block.required && <span className="text-red-500">*</span>}
                      </label>
                      <textarea
                        ref={el => el && (textareaRefs.current[block.id] = el)}
                        className="w-full min-h-[100px] px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 placeholder:text-gray-400 dark:placeholder:text-gray-600 resize-y focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={blockTypes.find(t => t.value === block.type)?.placeholder}
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, "content", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                </Card>
              ))}

              {availableBlockTypes.filter(t => !t.required).length > 0 && (
                <Button 
                  onClick={addBlock} 
                  variant="outline" 
                  className="w-full h-12 gap-2 text-sm border-dashed hover:border-solid"
                >
                  <Plus className="w-4 h-4" />
                  Добавить блок
                </Button>
              )}
            </div>
          </div>

          {/* Правая колонка - Предпросмотр и результат (стала шире) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Название промпта */}
            <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-2xl">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Название промпта
              </label>
              <input
                className="w-full px-3 py-3 text-lg border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Введите название..."
                value={promptName}
                onChange={(e) => setPromptName(e.target.value)}
              />
            </Card>

            {/* Предпросмотр */}
            <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Предпросмотр</h3>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={exportPromptOnly} 
                    className="gap-1.5 h-8"
                    title="Экспорт промпта в TXT"
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={copyPrompt} 
                    className="gap-1.5 h-8"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span className="text-xs">Скопировано</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-xs">Копировать</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg min-h-[250px] max-h-[350px] overflow-y-auto">
                {finalPrompt ? (
                  <pre className="text-sm font-mono whitespace-pre-wrap text-gray-800 dark:text-gray-300">
                    {finalPrompt}
                  </pre>
                ) : (
                  <div className="flex items-center justify-center h-40">
                    <p className="text-gray-400 text-sm">Заполните блоки для предпросмотра</p>
                  </div>
                )}
              </div>
              
              {validatePrompt() && (
                <Button 
                  className="w-full mt-4 h-12 gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={handleGetResult}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Генерируем...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Получить результат
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              )}
            </Card>

            {/* Ответ ИИ */}
            {showResponse && (
              <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-2xl border-2 border-blue-500/20">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">Ответ ИИ</h3>
                  </div>
                  <div className="flex gap-2">
                    {aiResponse && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={exportToTxt}
                          className="gap-1.5 h-8"
                          title="Экспорт промпта и ответа в TXT"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={copyResponse}
                          className="gap-1.5 h-8"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg min-h-[250px] max-h-[400px] overflow-y-auto">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-40">
                      <Sparkles className="w-8 h-8 text-blue-600 animate-pulse mb-3" />
                      <p className="text-sm text-gray-500">ИИ генерирует ответ...</p>
                      <p className="text-xs text-gray-400 mt-1">Это может занять несколько секунд</p>
                    </div>
                  ) : aiResponse ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {aiResponse.split('\n').map((line, i) => (
                        <p key={i} className="mb-2">{line}</p>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-40">
                      <p className="text-gray-400 text-sm">Ответ появится здесь</p>
                    </div>
                  )}
                </div>
                
                {aiResponse && (
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      className="flex-1 gap-2 text-sm"
                      onClick={() => navigate(`/dialog/new?prompt=${encodeURIComponent(promptName)}&response=${encodeURIComponent(aiResponse)}`)}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Диалог
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 gap-2 text-sm"
                      onClick={exportToTxt}
                    >
                      <Download className="w-4 h-4" />
                      Экспорт
                    </Button>
                  </div>
                )}
              </Card>
            )}

            {/* Советы */}
            {showTips && (
              <Card className="p-5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">Советы по созданию</h4>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 mt-1.5 bg-blue-600 rounded-full flex-shrink-0"></div>
                    <span className="text-xs text-gray-700 dark:text-gray-300">Будьте конкретны в описании задачи</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 mt-1.5 bg-blue-600 rounded-full flex-shrink-0"></div>
                    <span className="text-xs text-gray-700 dark:text-gray-300">Укажите роль для лучшего контекста</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 mt-1.5 bg-blue-600 rounded-full flex-shrink-0"></div>
                    <span className="text-xs text-gray-700 dark:text-gray-300">Добавьте примеры ожидаемого ответа</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 mt-1.5 bg-blue-600 rounded-full flex-shrink-0"></div>
                    <span className="text-xs text-gray-700 dark:text-gray-300">Ограничьте формат вывода при необходимости</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 mt-1.5 bg-blue-600 rounded-full flex-shrink-0"></div>
                    <span className="text-xs text-gray-700 dark:text-gray-300">Используйте температуру 0.7 для баланса</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 mt-1.5 bg-blue-600 rounded-full flex-shrink-0"></div>
                    <span className="text-xs text-gray-700 dark:text-gray-300">После получения ответа можете экспортировать в TXT</span>
                  </li>
                </ul>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}