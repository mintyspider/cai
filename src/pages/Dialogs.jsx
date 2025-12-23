// src/pages/Dialogs.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { formatDistanceToNow, format } from "date-fns";
import { ru } from "date-fns/locale";
import { 
  Clock, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Loader2, 
  Search, 
  Eye,
  MoreVertical,
  Folder,
  Calendar,
  User,
  AlertCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  Archive,
  Copy,
  Download,
  RefreshCw
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

export function Dialogs({ user }) {
  const navigate = useNavigate();
  const [dialogs, setDialogs] = useState([]);
  const [filteredDialogs, setFilteredDialogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [dialogToDelete, setDialogToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("updated_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedDialogs, setSelectedDialogs] = useState([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const itemsPerPage = 12;

  // Загрузка диалогов
  useEffect(() => {
    fetchDialogs();
  }, [currentPage, sortBy, sortOrder]);

  // Фильтрация при изменении поиска
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDialogs(dialogs);
    } else {
      const filtered = dialogs.filter(dialog =>
        dialog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dialog.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        dialog.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDialogs(filtered);
    }
  }, [searchQuery, dialogs]);

  const fetchDialogs = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        sort_by: sortBy,
        sort_order: sortOrder
      }).toString();

      const res = await fetch(`/api/dialogs?${queryParams}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.success) {
        setDialogs(data.data.dialogs || []);
        setFilteredDialogs(data.data.dialogs || []);
        setTotalPages(data.data.total_pages || 1);
      } else {
        toast.error(data.message || "Ошибка загрузки диалогов");
      }
    } catch (error) {
      console.error("Ошибка при загрузке диалогов:", error);
      toast.error("Нет связи с сервером");
    } finally {
      setIsLoading(false);
    }
  };

  // Создание нового диалога
  const createNewDialog = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/dialogs", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Новый диалог",
          description: "Описание диалога"
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Новый диалог создан");
        navigate(`/dialog/${data.data.dialog.id}`);
      } else {
        toast.error(data.message || "Ошибка создания диалога");
      }
    } catch (error) {
      console.error("Ошибка при создании диалога:", error);
      toast.error("Нет связи с сервером");
    }
  };

  // Подтверждение удаления диалога
  const confirmDeleteDialog = (dialog) => {
    setDialogToDelete(dialog);
    setShowDeleteDialog(true);
  };

  // Удаление диалога
  const deleteDialog = async () => {
    if (!dialogToDelete) return;

    setIsDeleting(prev => ({ ...prev, [dialogToDelete.id]: true }));

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/dialogs/${dialogToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Диалог удален");
        setDialogs(prev => prev.filter(dialog => dialog.id !== dialogToDelete.id));
        setSelectedDialogs(prev => prev.filter(id => id !== dialogToDelete.id));
      } else {
        toast.error(data.message || "Ошибка удаления диалога");
      }
    } catch (error) {
      console.error("Ошибка при удалении диалога:", error);
      toast.error("Нет связи с сервером");
    } finally {
      setIsDeleting(prev => ({ ...prev, [dialogToDelete.id]: false }));
      setShowDeleteDialog(false);
      setDialogToDelete(null);
    }
  };

  // Массовое удаление выбранных диалогов
  const deleteSelectedDialogs = async () => {
    if (selectedDialogs.length === 0) {
      toast.error("Выберите диалоги для удаления");
      return;
    }

    if (!window.confirm(`Удалить ${selectedDialogs.length} диалогов? Это действие нельзя отменить.`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/dialogs/batch-delete", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dialog_ids: selectedDialogs }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(`${selectedDialogs.length} диалогов удалено`);
        setDialogs(prev => prev.filter(dialog => !selectedDialogs.includes(dialog.id)));
        setSelectedDialogs([]);
        setIsSelectMode(false);
      } else {
        toast.error(data.message || "Ошибка удаления диалогов");
      }
    } catch (error) {
      console.error("Ошибка при удалении диалогов:", error);
      toast.error("Ошибка соединения");
    }
  };

  // Выделение/снятие выделения диалога
  const toggleDialogSelection = (dialogId) => {
    setSelectedDialogs(prev => 
      prev.includes(dialogId) 
        ? prev.filter(id => id !== dialogId)
        : [...prev, dialogId]
    );
  };

  // Выделить все/снять выделение
  const toggleSelectAll = () => {
    if (selectedDialogs.length === filteredDialogs.length) {
      setSelectedDialogs([]);
    } else {
      setSelectedDialogs(filteredDialogs.map(d => d.id));
    }
  };

  // Копирование диалога
  const duplicateDialog = async (dialogId, event) => {
    event.stopPropagation();

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/dialogs/${dialogId}/duplicate`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Диалог скопирован");
        fetchDialogs(); // Обновляем список
      } else {
        toast.error(data.message || "Ошибка копирования");
      }
    } catch (error) {
      console.error("Ошибка при копировании диалога:", error);
      toast.error("Ошибка соединения");
    }
  };

  // Архивирование диалога
  const archiveDialog = async (dialogId, event) => {
    event.stopPropagation();

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/dialogs/${dialogId}/archive`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Диалог архивирован");
        fetchDialogs(); // Обновляем список
      } else {
        toast.error(data.message || "Ошибка архивирования");
      }
    } catch (error) {
      console.error("Ошибка при архивировании диалога:", error);
      toast.error("Ошибка соединения");
    }
  };

  // Экспорт диалога
  const exportDialog = async (dialogId, event) => {
    event.stopPropagation();

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/dialogs/${dialogId}/export`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success && data.data.export_url) {
        // Скачиваем файл
        const link = document.createElement('a');
        link.href = data.data.export_url;
        link.download = `диалог_${dialogId}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success("Диалог экспортирован");
      } else {
        toast.error(data.message || "Ошибка экспорта");
      }
    } catch (error) {
      console.error("Ошибка при экспорте диалога:", error);
      toast.error("Ошибка соединения");
    }
  };

  // Переход в конкретный диалог
  const goToDialog = (dialogId) => {
    navigate(`/dialog/${dialogId}`);
  };

  // Пагинация
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  // Сортировка
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  if (isLoading && dialogs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Загрузка диалогов...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black pt-20 px-4 pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Хедер */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Мои диалоги
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {dialogs.length} диалогов, {selectedDialogs.length} выбрано
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {isSelectMode && selectedDialogs.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={deleteSelectedDialogs}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Удалить выбранные ({selectedDialogs.length})
                </Button>
              )}
              
              <Button
                variant={isSelectMode ? "default" : "outline"}
                onClick={() => setIsSelectMode(!isSelectMode)}
                className="gap-2"
              >
                {isSelectMode ? "Завершить выбор" : "Выбрать"}
              </Button>
              
              <Button
                onClick={createNewDialog}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 gap-2"
              >
                <Plus className="w-4 h-4" />
                Новый диалог
              </Button>
            </div>
          </div>

          {/* Панель поиска и фильтров */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Поиск */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Поиск по названию или тегам..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Сортировка */}
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                >
                  <option value="updated_at">По дате обновления</option>
                  <option value="created_at">По дате создания</option>
                  <option value="title">По названию</option>
                  <option value="prompt_count">По количеству промптов</option>
                </select>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  title={sortOrder === "asc" ? "По возрастанию" : "По убыванию"}
                >
                  {sortOrder === "asc" ? "↑" : "↓"}
                </Button>
              </div>

              {/* Обновить */}
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={fetchDialogs}
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Обновить
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Выбор всех */}
        {isSelectMode && filteredDialogs.length > 0 && (
          <div className="mb-4 flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedDialogs.length === filteredDialogs.length}
                onChange={toggleSelectAll}
                className="w-5 h-5 rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {selectedDialogs.length === filteredDialogs.length 
                  ? "Снять выделение со всех" 
                  : "Выделить все"
                }
              </span>
            </div>
            
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Выбрано: {selectedDialogs.length} из {filteredDialogs.length}
            </span>
          </div>
        )}

        {/* Список диалогов */}
        {filteredDialogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <MessageSquare className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                {searchQuery ? "Диалоги не найдены" : "Диалогов пока нет"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                {searchQuery 
                  ? "Попробуйте изменить поисковый запрос или создать новый диалог"
                  : "Создайте первый диалог, чтобы начать работу с ИИ"
                }
              </p>
              {!searchQuery && (
                <Button
                  onClick={createNewDialog}
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Создать первый диалог
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDialogs.map((dialog) => (
                <div
                  key={dialog.id}
                  className={`group relative bg-white dark:bg-gray-800 rounded-xl border transition-all duration-200 hover:shadow-lg ${
                    isSelectMode && selectedDialogs.includes(dialog.id)
                      ? "border-blue-500 dark:border-blue-400 border-2"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                  }`}
                >
                  {/* Чекбокс выбора */}
                  {isSelectMode && (
                    <div className="absolute left-3 top-3 z-10">
                      <input
                        type="checkbox"
                        checked={selectedDialogs.includes(dialog.id)}
                        onChange={() => toggleDialogSelection(dialog.id)}
                        className="w-5 h-5 rounded border-gray-300 bg-white"
                      />
                    </div>
                  )}

                  {/* Основное содержимое */}
                  <div 
                    className={`p-5 ${!isSelectMode ? 'cursor-pointer' : ''}`}
                    onClick={() => !isSelectMode && goToDialog(dialog.id)}
                  >
                    {/* Заголовок */}
                    <div className="mb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                            {dialog.title || "Без названия"}
                          </h3>
                        </div>
                        
                        {/* Бейдж количества промптов */}
                        <div className="flex-shrink-0 ml-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            {dialog.prompt_count || 0}
                          </span>
                        </div>
                      </div>
                      
                      {/* Описание */}
                      {dialog.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                          {dialog.description}
                        </p>
                      )}
                    </div>

                    {/* Теги */}
                    {dialog.tags && dialog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {dialog.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {dialog.tags.length > 3 && (
                          <span className="px-2 py-1 text-gray-500 text-xs">
                            +{dialog.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Метаданные */}
                    <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          {formatDistanceToNow(new Date(dialog.updated_at), { 
                            addSuffix: true, 
                            locale: ru 
                          })}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {format(new Date(dialog.created_at), "dd.MM.yyyy", { locale: ru })}
                        </span>
                      </div>
                      
                      {dialog.last_prompt && (
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          <span className="truncate">
                            {dialog.last_prompt.substring(0, 40)}...
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Кнопки действий */}
                  <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => goToDialog(dialog.id)}
                      className="gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      Открыть
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => goToDialog(dialog.id)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Просмотр
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={() => navigate(`/builder?dialog=${dialog.id}`)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Добавить промпт
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={(e) => duplicateDialog(dialog.id, e)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Дублировать
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={(e) => exportDialog(dialog.id, e)}>
                          <Download className="w-4 h-4 mr-2" />
                          Экспорт
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={(e) => archiveDialog(dialog.id, e)}>
                          <Archive className="w-4 h-4 mr-2" />
                          Архивировать
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDeleteDialog(dialog);
                          }}
                          className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>

            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-8">
                <nav className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Назад
                  </Button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        onClick={() => goToPage(pageNum)}
                        className="w-10"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  <Button
                    variant="outline"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="gap-1"
                  >
                    Вперед
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>

      {/* Диалог подтверждения удаления */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Удаление диалога
            </AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить диалог "{dialogToDelete?.title}"?
              <br />
              <span className="font-medium text-red-600 dark:text-red-400">
                Это действие нельзя отменить. Все промпты внутри диалога также будут удалены.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteDialog}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              disabled={isDeleting[dialogToDelete?.id]}
            >
              {isDeleting[dialogToDelete?.id] ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Удаление...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Удалить
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}