import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Import the CSS file

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/todo")
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the todos!", error);
      });
  }, []);

  const addTodo = () => {
    axios
      .post("http://localhost:8080/todo", {
        title: newTodo,
        isCompleted: false,
      })
      .then((response) => {
        setTodos([...todos, response.data]);
        setNewTodo("");
      })
      .catch((error) => {
        console.error("There was an error adding the todo!", error);
      });
  };

  const toggleCompletion = (id, isCompleted) => {
    axios
      .put(`http://localhost:8080/todo/${id}`, { isCompleted: !isCompleted })
      .then(() => {
        const updatedTodos = todos.map((todo) =>
          todo.id === id ? { ...todo, isCompleted: !isCompleted } : todo
        );
        setTodos(updatedTodos);
      })
      .catch((error) => {
        console.error("There was an error updating the todo!", error);
      });
  };

  const deleteTodo = (id) => {
    axios
      .delete(`http://localhost:8080/todo/${id}`)
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id));
      })
      .catch((error) => {
        console.error("There was an error deleting the todo!", error);
      });
  };

  return (
    <div className="todo-container">
      <h1 className="todo-header">ToDo List</h1>
      <div className="todo-input-container">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          className="todo-input"
        />
        <button className="todo-button" onClick={addTodo}>
          Add Todo
        </button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <span
              className={`todo-title ${todo.isCompleted ? "completed" : ""}`}
            >
              {todo.title}
            </span>
            <div className="todo-actions">
              <button
                className={`action-button ${
                  todo.isCompleted ? "undo" : "complete"
                }`}
                onClick={() => toggleCompletion(todo.id, todo.isCompleted)}
              >
                {todo.isCompleted ? "Undo" : "Complete"}
              </button>
              <button
                className="action-button delete"
                onClick={() => deleteTodo(todo.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
