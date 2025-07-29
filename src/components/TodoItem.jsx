import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faSave,
  faTrash,
  faGripVertical,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useTodoContext } from "../contexts";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { formatFullDate, formatTimeAgo } from "../utils/timeFormatter";

function TodoItem({ todo }) {
  const [isTodoEditable, setIsTodoEditable] = useState(false);
  const [todoMessage, setTodoMessage] = useState(todo.todo);
  const { updateTodo, deleteTodo, toggleTodoSelection } = useTodoContext();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo?.id });

  const style = {
    transform: CSS?.Transform?.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const editTodo = () => setIsTodoEditable(true);
  const saveTodo = () => {
    setIsTodoEditable(false);
    updateTodo(todo?.id, todoMessage);
  };

  const toggleSelection = () => {
    toggleTodoSelection(todo?.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex justify-between items-center w-full p-4 rounded-xl transition-all duration-300 ${
        isDragging ? "shadow-2xl" : "shadow-md"
      } ${
        todo?.completed
          ? "bg-gradient-to-r from-emerald-900/30 to-emerald-800/30 border-l-4 border-emerald-500"
          : "bg-gradient-to-r from-slate-800/60 to-slate-700/60 border-l-4 border-blue-500"
      } group relative overflow-hidden backdrop-blur-sm`}
    >
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Glow effect for completed todos */}
      {todo?.completed && (
        <div className="absolute inset-0 bg-emerald-500/5 animate-pulse rounded-xl"></div>
      )}

      <div className="flex items-center gap-3 w-full z-10">
        {/* Drag handle and checkbox */}
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="text-slate-400 hover:text-blue-400 cursor-move p-2 -ml-1 opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faGripVertical} className="text-sm" />
          </button>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={todo?.selected || false}
              onChange={toggleSelection}
              className="sr-only peer"
            />
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                todo?.selected
                  ? "bg-blue-500 border-blue-500"
                  : "bg-slate-700/80 border-slate-500 group-hover:border-blue-400"
              }`}
            >
              {todo?.selected && (
                <FontAwesomeIcon
                  icon={faCheck}
                  className="text-white text-xs"
                />
              )}
            </div>
          </label>
        </div>

        {/* Todo text input */}
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={todoMessage}
            onChange={(e) => setTodoMessage(e.target.value)}
            readOnly={!isTodoEditable}
            className={`w-full bg-transparent outline-none font-medium truncate ${
              todo?.completed
                ? "line-through text-emerald-200/80"
                : "text-white"
            } ${
              isTodoEditable
                ? "border-b border-blue-400/50 pb-1 px-1 -mx-1 bg-slate-700/50 rounded"
                : ""
            }`}
          />

          {/* Timestamp with tooltip */}
          <div className="relative group/timestamp mt-1">
            <span className="text-xs text-slate-400 cursor-default">
              {formatTimeAgo(todo?.createdAt)}
            </span>
            <div className="absolute bottom-full left-10 hidden group-hover/timestamp:block bg-slate-800 text-white text-xs rounded whitespace-nowrap z-20 shadow-lg border border-slate-700">
              {formatFullDate(todo?.createdAt)}
              <div className="absolute top-full left-2 w-0 h-0 border-l-4 border-r-4 border-b-0 border-t-4 border-slate-800 border-x-transparent"></div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 ml-2">
          {!isTodoEditable ? (
            <button
              onClick={editTodo}
              disabled={todo?.completed}
              title="Edit"
              className={`p-2 rounded-lg transition-all ${
                todo?.completed
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-500/20 text-blue-400 hover:text-blue-300"
              }`}
            >
              <FontAwesomeIcon icon={faPenToSquare} className="text-sm" />
            </button>
          ) : (
            <button
              onClick={saveTodo}
              title="Save"
              className="p-2 rounded-lg hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 transition-all"
            >
              <FontAwesomeIcon icon={faSave} className="text-sm" />
            </button>
          )}
          <button
            onClick={() => deleteTodo(todo?.id)}
            title="Delete"
            className="p-2 rounded-lg hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-all"
          >
            <FontAwesomeIcon icon={faTrash} className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoItem;
