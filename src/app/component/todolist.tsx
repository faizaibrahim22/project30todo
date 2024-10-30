"use client";
import { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const Todolist = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTaskText, setEditingTaskText] = useState<string>("");
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Load tasks from localStorage when the component mounts
  useEffect(() => {
    setIsMounted(true);
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks) as Task[]);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, isMounted]);

  const addTasks = (): void => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  const toggleTaskCompletion = (id: number): void => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };
  const startEditingTask = (id: number, text: string): void => {
    setEditingTaskId(id);
    setEditingTaskText(text);
  };

  const updateTask = (): void => {
    if (editingTaskText.trim() !== "") {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editingTaskId ? { ...task, text: editingTaskText } : task
        )
      );
      setEditingTaskId(null);
      setEditingTaskText("");
    }
  };

  // Delete a task
  const deleteTask = (id: number): void => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-orange-500 dark:bg-rose-400">
      <div className="w-full max-w-md border-r-green-300 shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-5 text-black dark:text-yellow">
          TODO LIST
        </h1>
        <div className="flex items-center mb-5">
          <Input
            type="text"
            placeholder="Add a task"
            value={newTask}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewTask(e.target.value)
            }
            className="flex-1 mr-2 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          />
          <Button
            onClick={addTasks}
            className='border-y-blue-600 hover:bg-black text-white font-medium py-4 px-6 rounded-md'
          >
            Add
          </Button>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between bg-yellow-50 dark:bg-stone-700 rounded-md py-4 px-2"
            >
              <div className="flex items-center">
                <Checkbox
                  checked={task.completed}
                  className="mr-2"
                  onChange={() => toggleTaskCompletion(task.id)}
                />
                {editingTaskId === task.id ? (
                  <Input
                    type="text"
                    value={editingTaskText}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setEditingTaskText(e.target.value)
                    }
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter") {
                        updateTask();
                      }
                    }}
                    className="flex-1 py-4 px-3 rounded-md border border-gray-300 dark:borde-600 dark:bg-fuchsia-500 dark:text-gray-300"
                  />
                ) : (
                  <span
                    className={`flex-1 text-gray-800 dark:text-gray-200 ${
                      task.completed
                        ? "line-through text-gray-500 dark:text-gray-400"
                        : ""
                    }`}
                  >
                    {task.text}
                  </span>
                )}
              </div>
              <div className="flex items-center">
                {editingTaskId === task.id ? (
                  <Button
                    onClick={updateTask}
                    className="bg-black hover:bg- text-white font-medium py-1 px-2 rounded-md mr-2"
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    onClick={() => startEditingTask(task.id, task.text)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 font-medium py-1 px-2 rounded-md mr-2"
                  >
                    Edit
                  </Button>
                )}
                <Button
                  onClick={() => deleteTask(task.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 rounded-md"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Todolist;
