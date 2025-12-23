// src/pages/Dialog.jsx
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { 
  Copy, 
  ArrowLeft, 
  Clock, 
  Tag, 
  Edit, 
  Plus, 
  Trash2, 
  MessageSquare,
  Download,
  Share2,
  MoreVertical,
  Bot,
  User,
  Send,
  History,
  FileText,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  RefreshCw,
  Eye,
  EyeOff,
  HelpCircle
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../components/ui/dropdown-menu";

export function Dialog({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [dialog, setDialog] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [showFullPrompt, setShowFullPrompt] = useState(false);
  const [showFullResponse, setShowFullResponse] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [conversationMode, setConversationMode] = useState(false);
  const [conversationMessages, setConversationMessages] = useState([]);

  // Автоскролл к последнему сообщению
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationMessages]);

  // Загрузка диалога
  useEffect(() => {
    if (id) {
      fetchDialog();
    }
  }, [id]);

  // Загрузка диалога
  const fetchDialog = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/dialogs/${id}`, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      
      const data = await res.json();
      
      if (data.success) {
        setDialog(data.data.dialog);
        setPrompts(data.data.prompts || []);
        
        // Если есть промпты, собираем историю для режима беседы
        if (data.data.prompts && data.data.prompts.length > 0) {
          const messages = [];
          data.data.prompts.forEach(prompt => {
            if (prompt.prompt_content) {
              messages.push({
                id: `${prompt.id}_prompt`,
                content: prompt.prompt_content,
                role: "user",
                is_user: true,
                created_at: prompt.created_at,
                prompt_id: prompt.id
              });
            }
            if (prompt.response_content) {
              messages.push({
                id: `${prompt.id}_response`,
                content: prompt.response_content,
                role: "assistant",
                is_user: false,
                created_at: prompt.created_at,
                prompt_id: prompt.id
              });
            }
          });
          setConversationMessages(messages);
        }
      } else {
        toast.error(data.message || "Диалог не найден");
        navigate("/dialogs");
      }
    } catch (error) {
      console.error("Ошибка загрузки диалога:", error);
      toast.error("Ошибка загрузки диалога");
      navigate("/dialogs");
    } finally {
      setIsLoading(false);
    }
  };

  // Копирование текста
  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Скопировано в буфер обмена");
  };

  // Удаление диалога
  const deleteDialog = async () => {
    if (!window.confirm("Удалить этот диалог? Это действие нельзя отменить.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/dialogs/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.success("Диалог удален");
        navigate("/dialogs");
      } else {
        toast.error(data.message || "Ошибка удаления");
      }
    } catch (error) {
      console.error("Ошибка удаления диалога:", error);
      toast.error("Ошибка удаления диалога");
    } finally {
      setIsDeleting(false);
    }
  };

  // Удаление конкретного промпта
  const deletePrompt = async (promptId, event) => {
    event.stopPropagation();
    
    if (!window.confirm("Удалить этот промпт из диалога?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/dialogs/${id}/prompts/${promptId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.success("Промпт удален");
        fetchDialog(); // Перезагружаем диалог
      } else {
        toast.error(data.message || "Ошибка удаления промпта");
      }
    } catch (error) {
      console.error("Ошибка удаления промпта:", error);
      toast.error("Ошибка удаления промпта");
    }
  };

  // Навигация по промптам
  const goToPrevPrompt = () => {
    if (currentPromptIndex > 0) {
      setCurrentPromptIndex(prev => prev - 1);
    }
  };

  const goToNextPrompt = () => {
    if (currentPromptIndex < prompts.length - 1) {
      setCurrentPromptIndex(prev => prev + 1);
    }
  };

  // Экспорт диалога
  const exportDialog = () => {
    if (!dialog || prompts.length === 0) {
      toast.error("Нет данных для экспорта");
      return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const filename = `диалог_${dialog.title.replace(/\s+/g, '_')}_${timestamp}.txt`;
    
    let content = `========================================
ДИАЛОГ: ${dialog.title}
Создан: ${new Date(dialog.created_at).toLocaleString('ru-RU')}
Обновлен: ${new Date(dialog.updated_at).toLocaleString('ru-RU')}
Количество промптов: ${prompts.length}
========================================\n\n`;

    prompts.forEach((prompt, index) => {
      content += `=================== ПРОМПТ ${index + 1} ===================\n\n`;
      
      if (prompt.prompt_title) {
        content += `Название: ${prompt.prompt_title}\n`;
      }
      
      if (prompt.blocks && prompt.blocks.length > 0) {
        content += `\n--- БЛОКИ ПРОМПТА ---\n`;
        prompt.blocks.forEach((block, i) => {
          content += `\n[${block.label}] ${block.required ? '(обязательный)' : ''}\n`;
          content += `${block.content}\n`;
        });
        content += `\n`;
      }
      
      content += `--- ПРОМПТ ---\n${prompt.prompt_content}\n\n`;
      content += `--- ОТВЕТ ИИ ---\n${prompt.response_content}\n\n`;
      
      if (prompt.metadata) {
        content += `Модель: ${prompt.metadata.model || 'не указана'}\n`;
        content += `Температура: ${prompt.metadata.temperature || 'не указана'}\n`;
      }
      
      content += `Дата: ${new Date(prompt.created_at).toLocaleString('ru-RU')}\n`;
      content += `\n${'='.repeat(50)}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`Диалог экспортирован в ${filename}`);
  };

  // Экспорт конкретного промпта
  const exportPrompt = (prompt) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const promptName = prompt.prompt_title || `промпт_${prompt.id}`;
    const filename = `${promptName}_${timestamp}.txt`;
    
    let content = `========================================
ПРОМПТ ИЗ ДИАЛОГА: ${dialog.title}
Создан: ${new Date(prompt.created_at).toLocaleString('ru-RU')}
========================================\n\n`;

    if (prompt.prompt_title) {
      content += `Название промпта: ${prompt.prompt_title}\n\n`;
    }
    
    if (prompt.blocks && prompt.blocks.length > 0) {
      content += `--- СТРУКТУРИРОВАННЫЕ БЛОКИ ---\n\n`;
      prompt.blocks.forEach((block, i) => {
        content += `[${block.label}] ${block.required ? '(обязательный)' : ''}\n`;
        content += `${block.content}\n\n`;
      });
    }
    
    content += `--- ПРОМПТ ---\n${prompt.prompt_content}\n\n`;
    content += `--- ОТВЕТ ИИ ---\n${prompt.response_content}\n\n`;
    
    if (prompt.metadata) {
      content += `Модель: ${prompt.metadata.model || 'не указана'}\n`;
      content += `Температура: ${prompt.metadata.temperature || 'не указана'}\n`;
      content += `Сгенерирован: ${new Date(prompt.metadata.generated_at).toLocaleString('ru-RU')}\n`;
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`Промпт экспортирован в ${filename}`);
  };

  // Навигация в конструктор промптов
  const navigateToEditPrompt = (promptId) => {
    navigate(`/builder?edit=${promptId}&dialog=${id}`);
  };

  const navigateToAddPrompt = () => {
    navigate(`/builder?dialog=${id}`);
  };

  const navigateToContinueDialog = () => {
    // Собираем контекст из последних ответов
    const lastResponses = prompts.slice(-3).map(p => p.response_content).join('\n\n');
    navigate(`/builder?dialog=${id}&continue=true`);
  };

  // Отправка нового сообщения в режиме беседы
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    setIsSending(true);
    const messageToSend = newMessage.trim();
    setNewMessage("");

    // Добавляем сообщение пользователя
    const userMessage = {
      id: Date.now(),
      content: messageToSend,
      role: "user",
      is_user: true,
      created_at: new Date().toISOString()
    };
    
    setConversationMessages(prev => [...prev, userMessage]);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/dialogs/${id}/chat`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: messageToSend,
          context: conversationMessages.slice(-5).map(m => m.content).join('\n\n')
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Добавляем ответ ИИ
        const aiMessage = {
          id: Date.now() + 1,
          content: data.response,
          role: "assistant",
          is_user: false,
          created_at: new Date().toISOString()
        };
        
        setConversationMessages(prev => [...prev, aiMessage]);
      } else {
        toast.error(data.message || "Ошибка получения ответа");
      }
    } catch (error) {
      console.error("Ошибка отправки сообщения:", error);
      toast.error("Ошибка соединения");
    } finally {
      setIsSending(false);
    }
  };

  // Получение текущего промпта
  const currentPrompt = prompts[currentPromptIndex];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black pt-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Загрузка диалога...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!dialog) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black pt-20 px-4">
        <div className="max-w-6xl mx-auto text-center py-16">
          <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Диалог не найден</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Возможно, этот диалог был удален или у вас нет к нему доступа.</p>
          <Button onClick={() => navigate("/dialogs")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Вернуться к диалогам
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black pt-20 px-4 pb-8">
      <div className="max-w-6xl mx-auto">
        {/* Хедер диалога */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/dialogs")}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {dialog.title}
                </h1>
                
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {format(new Date(dialog.created_at), "d MMMM yyyy, HH:mm", { locale: ru })}
                  </span>
                  
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {prompts.length} промпт{prompts.length % 10 === 1 && prompts.length !== 11 ? '' : 'а' || 'ов'}
                  </span>
                  
                  {dialog.tags && dialog.tags.length > 0 && (
                    <div className="flex gap-1">
                      {dialog.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs flex items-center gap-1"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setConversationMode(!conversationMode)}
                className="gap-2"
              >
                {conversationMode ? (
                  <>
                    <FileText className="w-4 h-4" />
                    Показать промпты
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4" />
                    Режим беседы
                  </>
                )}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={navigateToAddPrompt}>
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить промпт
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={navigateToContinueDialog}>
                    <History className="w-4 h-4 mr-2" />
                    Продолжить диалог
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={exportDialog}>
                    <Download className="w-4 h-4 mr-2" />
                    Экспорт диалога
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => copyText(prompts.map(p => p.prompt_content + '\n\n' + p.response_content).join('\n\n'))}>
                    <Copy className="w-4 h-4 mr-2" />
                    Скопировать все
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={deleteDialog}
                    className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Удалить диалог
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Переключение режимов */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant={!conversationMode ? "default" : "outline"}
                onClick={() => setConversationMode(false)}
                size="sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                Промпты ({prompts.length})
              </Button>
              <Button
                variant={conversationMode ? "default" : "outline"}
                onClick={() => setConversationMode(true)}
                size="sm"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Беседа
              </Button>
            </div>
            
            {!conversationMode && prompts.length > 0 && (
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPrevPrompt}
                  disabled={currentPromptIndex === 0}
                  className="gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Назад
                </Button>
                
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {currentPromptIndex + 1} / {prompts.length}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPrompt}
                  disabled={currentPromptIndex === prompts.length - 1}
                  className="gap-1"
                >
                  Вперед
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Режим просмотра промптов */}
        {!conversationMode && prompts.length > 0 && currentPrompt && (
          <div className="space-y-8">
            {/* Заголовок текущего промпта */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentPrompt.prompt_title || `Промпт ${currentPromptIndex + 1}`}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {formatDistanceToNow(new Date(currentPrompt.created_at), { 
                    addSuffix: true, 
                    locale: ru 
                  })}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateToEditPrompt(currentPrompt.id)}
                  className="gap-1"
                >
                  <Edit className="w-4 h-4" />
                  Редактировать
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => exportPrompt(currentPrompt)}>
                      <Download className="w-4 h-4 mr-2" />
                      Экспорт промпта
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => copyText(currentPrompt.prompt_content + '\n\n' + currentPrompt.response_content)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Скопировать промпт и ответ
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={(e) => deletePrompt(currentPrompt.id, e)}
                      className="text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Удалить промпт
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Блоки промпта (если есть) */}
            {currentPrompt.blocks && currentPrompt.blocks.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Структура промпта
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentPrompt.blocks.map((block, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            block.required 
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" 
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          }`}>
                            {block.label} {block.required && "*"}
                          </div>
                          <span className="text-xs text-gray-500">Тип: {block.type}</span>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {block.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Промпт */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">Промпт</h3>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFullPrompt(!showFullPrompt)}
                      className="gap-1"
                    >
                      {showFullPrompt ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          Свернуть
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          Развернуть
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyText(currentPrompt.prompt_content)}
                      className="gap-1"
                    >
                      <Copy className="w-4 h-4" />
                      Копировать
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <pre className={`font-mono text-sm text-gray-800 dark:text-gray-300 whitespace-pre-wrap ${!showFullPrompt ? 'max-h-96 overflow-y-auto' : ''}`}>
                  {currentPrompt.prompt_content}
                </pre>
              </div>
            </div>

            {/* Ответ ИИ */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-green-50 dark:bg-green-900/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">Ответ ИИ</h3>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFullResponse(prev => ({
                        ...prev,
                        [currentPrompt.id]: !prev[currentPrompt.id]
                      }))}
                      className="gap-1"
                    >
                      {showFullResponse[currentPrompt.id] ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          Свернуть
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          Развернуть
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyText(currentPrompt.response_content)}
                      className="gap-1"
                    >
                      <Copy className="w-4 h-4" />
                      Копировать
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className={`prose prose-lg dark:prose-invert max-w-none ${!showFullResponse[currentPrompt.id] ? 'max-h-96 overflow-y-auto' : ''}`}>
                  {currentPrompt.response_content.split('\n').map((line, i) => (
                    <p key={i} className="mb-3">{line}</p>
                  ))}
                </div>
                
                {/* Метаданные */}
                {currentPrompt.metadata && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      {currentPrompt.metadata.model && (
                        <span>Модель: {currentPrompt.metadata.model}</span>
                      )}
                      {currentPrompt.metadata.temperature && (
                        <span>Температура: {currentPrompt.metadata.temperature}</span>
                      )}
                      {currentPrompt.metadata.generated_at && (
                        <span>
                          Сгенерировано: {format(new Date(currentPrompt.metadata.generated_at), "HH:mm", { locale: ru })}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Кнопки навигации внизу */}
            {prompts.length > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={goToPrevPrompt}
                  disabled={currentPromptIndex === 0}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Предыдущий промпт
                </Button>
                
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Промпт {currentPromptIndex + 1} из {prompts.length}
                </span>
                
                <Button
                  variant="outline"
                  onClick={goToNextPrompt}
                  disabled={currentPromptIndex === prompts.length - 1}
                  className="gap-2"
                >
                  Следующий промпт
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Режим беседы */}
        {conversationMode && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 h-[500px] overflow-y-auto">
              {conversationMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <MessageSquare className="w-16 h-16 mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">Беседа пуста</p>
                  <p className="text-sm text-center">
                    Начните общение или переключитесь в режим промптов
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {conversationMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.is_user ? "justify-end" : ""}`}
                    >
                      {!message.is_user && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-green-600 dark:text-green-300" />
                        </div>
                      )}

                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.is_user
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none"
                        }`}
                      >
                        <div className="whitespace-pre-wrap break-words">
                          {message.content}
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs opacity-75">
                            {format(new Date(message.created_at), "HH:mm")}
                          </span>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                            onClick={() => copyText(message.content)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {message.is_user && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Форма отправки сообщения */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Введите сообщение для продолжения диалога..."
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 resize-none h-20"
                  disabled={isSending}
                />
                
                {newMessage.trim() && (
                  <Button
                    onClick={() => setNewMessage("")}
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 h-8 w-8 p-0"
                  >
                    ✕
                  </Button>
                )}
              </div>
              
              <Button
                onClick={sendMessage}
                disabled={isSending || !newMessage.trim()}
                className="bg-green-600 hover:bg-green-700 h-20 px-6"
              >
                {isSending ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Отправить
                  </>
                )}
              </Button>
            </div>

            {/* Подсказки */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Режим беседы</h4>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                В этом режиме вы можете продолжить диалог в формате чата. Ваши сообщения будут добавляться в историю диалога.
              </p>
            </div>
          </div>
        )}

        {/* Если нет промптов */}
        {!conversationMode && prompts.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Диалог пуст</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              В этом диалоге пока нет промптов. Создайте первый промпт, чтобы начать работу.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={navigateToAddPrompt} className="gap-2">
                <Plus className="w-4 h-4" />
                Добавить промпт
              </Button>
              <Button variant="outline" onClick={() => navigate("/builder")} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Создать в конструкторе
              </Button>
            </div>
          </div>
        )}

        {/* Список всех промптов (миниатюры) */}
        {!conversationMode && prompts.length > 1 && (
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Все промпты в диалоге</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {prompts.map((prompt, index) => (
                <div
                  key={prompt.id}
                  onClick={() => setCurrentPromptIndex(index)}
                  className={`bg-white dark:bg-gray-800 border rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
                    currentPromptIndex === index
                      ? "border-blue-500 dark:border-blue-400 border-2"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-300">
                          {index + 1}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white truncate">
                        {prompt.prompt_title || `Промпт ${index + 1}`}
                      </h4>
                    </div>
                    
                    <span className="text-xs text-gray-500">
                      {format(new Date(prompt.created_at), "HH:mm")}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                    {prompt.prompt_content.substring(0, 100)}...
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Bot className="w-3 h-3" />
                      Ответ получен
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToEditPrompt(prompt.id);
                      }}
                      className="h-6 text-xs"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}