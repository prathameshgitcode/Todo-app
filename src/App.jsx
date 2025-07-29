import { useEffect, useState } from "react";
import "./App.css";
import TodoHeader from "./components/TodoHeader";
import TodoList from "./components/TodoList";
import { TodoContextProvider } from "./contexts/index";

function App() {
  const [todos, setTodos] = useState([]);

  const addTodo = (todo) => {
    setTodos((prevTodos) => [
      {
        ...todo,
        createdAt: new Date()?.toISOString(),
      },
      ...prevTodos,
    ]);
  };

  const updateTodo = (id, todoMessage) => {
    setTodos((prevTodos) =>
      prevTodos?.map((prevTodo) =>
        prevTodo?.id === id ? { ...prevTodo, todo: todoMessage } : prevTodo
      )
    );
  };

  const toggleTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos?.map((prevTodo) =>
        prevTodo?.id === id
          ? { ...prevTodo, completed: !prevTodo?.completed }
          : prevTodo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos?.filter((prevTodo) => prevTodo?.id !== id)
    );
  };

  useEffect(() => {
    const todos = JSON?.parse(localStorage?.getItem("todos"));

    if (todos && todos?.length > 0) {
      const todosWithSelectionCleared = todos?.map((todo) => ({
        ...todo,
        selected: false,
      }));
      setTodos(todosWithSelectionCleared);
    }
  }, []);

  useEffect(() => {
    const todosToSave = todos?.map(({ selected, ...rest }) => rest);
    localStorage?.setItem("todos", JSON?.stringify(todosToSave));
  }, [todos]);

  const toggleTodoSelection = (id) => {
    setTodos((prevTodos) =>
      prevTodos?.map((todo) =>
        todo?.id === id ? { ...todo, selected: !todo?.selected } : todo
      )
    );
  };

  const toggleSelectAll = () => {
    setTodos((prevTodos) => {
      const allSelected = prevTodos?.every((todo) => todo?.selected);
      return prevTodos?.map((todo) => ({ ...todo, selected: !allSelected }));
    });
  };

  const deleteSelected = () => {
    setTodos((prevTodos) => prevTodos?.filter((todo) => !todo?.selected));
  };

  return (
    <TodoContextProvider
      value={{
        todos,
        addTodo,
        deleteTodo,
        toggleTodo,
        updateTodo,
        toggleTodoSelection,
        toggleSelectAll,
        deleteSelected,
        setTodos,
      }}
    >
      <div className="min-w-full min-h-dvh bg-gradient-to-br from-slate-900 to-slate-800 p-4">
        <div className="max-w-7xl mx-auto">
          <TodoHeader />
          <TodoList />
        </div>
      </div>
    </TodoContextProvider>
  );
}

export default App;
