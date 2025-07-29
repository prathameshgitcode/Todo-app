import { useState, useMemo } from "react";
import TodoItem from "./TodoItem";
import { useTodoContext } from "../contexts";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDownAZ,
  faArrowUpZA,
  faArrowsUpDown,
  faSearch,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

function TodoList() {
  const { todos, toggleSelectAll, deleteSelected, setTodos } = useTodoContext();
  const [sortMode, setSortMode] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  const allSelected =
    todos?.length > 0 && todos?.every((todo) => todo?.selected);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      onActivation: () => {
        if (sortMode) {
          setSortMode(null);
        }
        setIsDragging(true);
      },
    }),
    useSensor(KeyboardSensor)
  );

  const filteredTodos = useMemo(() => {
    if (!searchQuery) return [...todos];
    return todos?.filter((todo) =>
      todo?.todo?.toLowerCase()?.includes(searchQuery?.toLowerCase())
    );
  }, [todos, searchQuery]);

  const sortedTodos = useMemo(() => {
    const todosToSort = [...filteredTodos];
    if (sortMode && !isDragging) {
      todosToSort?.sort((a, b) => {
        const dateA = new Date(a?.createdAt);
        const dateB = new Date(b?.createdAt);
        return sortMode === "newest" ? dateB - dateA : dateA - dateB;
      });
    }
    return todosToSort;
  }, [filteredTodos, sortMode, isDragging]);

  function handleDragEnd(event) {
    const { active, over } = event;
    setIsDragging(false);

    if (active?.id !== over?.id) {
      setTodos((items) => {
        const oldIndex = items?.findIndex((item) => item?.id === active?.id);
        const newIndex = items?.findIndex((item) => item?.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const toggleSortOrder = () => {
    if (!sortMode) {
      setSortMode("newest");
    } else if (sortMode === "newest") {
      setSortMode("oldest");
    } else {
      setSortMode(null);
    }
  };

  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    if (isSearchActive) {
      setSearchQuery("");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-10 px-4">
      {/* Only show select controls when there are todos */}
      {todos?.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-slate-700/70">
          <div className="flex items-center gap-3 w-full">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                onChange={toggleSelectAll}
                checked={allSelected}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-white">
                Select All
              </span>
            </label>

            {isSearchActive && (
              <div className="relative flex-1 max-w-md ml-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search todos..."
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  autoFocus
                />
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSearch}
                title="Search todos"
                className={`p-2 rounded-lg transition-all ${
                  isSearchActive
                    ? "bg-blue-600/80 text-white"
                    : "bg-slate-700/50 hover:bg-slate-700 text-blue-400 hover:text-blue-300"
                }`}
              >
                <FontAwesomeIcon icon={isSearchActive ? faTimes : faSearch} />
              </button>

              <button
                onClick={toggleSortOrder}
                title={
                  !sortMode
                    ? "Sort by Date"
                    : sortMode === "newest"
                      ? "Sort Oldest First"
                      : "Return to Manual Sorting"
                }
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all border ${
                  !sortMode
                    ? "bg-slate-700/50 hover:bg-slate-700 text-blue-400 hover:text-blue-300 border-slate-600/50"
                    : sortMode === "newest"
                      ? "bg-blue-600/80 hover:bg-blue-600 text-white border-blue-500/50"
                      : "bg-blue-500/80 hover:bg-blue-500 text-white border-blue-400/50"
                }`}
              >
                <FontAwesomeIcon
                  icon={
                    !sortMode
                      ? faArrowsUpDown
                      : sortMode === "newest"
                        ? faArrowDownAZ
                        : faArrowUpZA
                  }
                  className="text-sm"
                />
                <span>
                  {!sortMode
                    ? "Sort"
                    : sortMode === "newest"
                      ? "Newest first"
                      : "Oldest first"}
                </span>
              </button>

              <button
                onClick={deleteSelected}
                className="flex min-w-[10rem] items-center  gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-red-600/90 to-rose-600/90 text-white hover:from-red-700 hover:to-rose-700 transition-all shadow-md hover:shadow-red-500/20 active:scale-95"
              >
                <span className="">Delete Selected</span>
                <span className="text-xs bg-white/20  py-1 rounded-full">
                  {todos?.filter((todo) => todo?.selected)?.length}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {todos?.length > 0 ? (
        filteredTodos?.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedTodos}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-3">
                {sortedTodos?.map((todo) => (
                  <TodoItem
                    key={todo?.id}
                    todo={todo}
                    dragDisabled={!!sortMode && !isDragging}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="text-center py-10 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <p className="text-xl text-slate-400">No tasks match your search</p>
          </div>
        )
      ) : (
        <div className="text-center mt-20">
          <div className="inline-block p-8 bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-xl">
            <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              No Tasks Yet
            </p>
            <p className="text-slate-400 text-lg">
              Add a new task to get started!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoList;
