import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import confetti from "canvas-confetti";

import TodoBoard from "./components/TodoBoard";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { useEffect, useState } from "react";
import api from "./utils/api";

function App() {
  const [todoList, setTodoList] = useState([]);

  const [todoValue, setTodoValue] = useState("");

  const getTasks = async () => {
    const response = await api.get("/tasks");
    console.log("hello", response);
    setTodoList(response.data.data);
  };

  const addTask = async () => {
    try {
      const response = await api.post("/tasks", {
        task: todoValue,
        isComplete: false,
      });
      if (response.status === 200) {
        console.log("Success!");
        setTodoValue("");
        getTasks();
      } else {
        throw new Error("Task cannot be added");
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  const taskComplete = async (id) => {
    try {
      const task = todoList.find((item) => item._id === id);
      const response = await api.put(`/tasks/${id}`, {
        isComplete: !task.isComplete,
      });
      if (response.status === 200) {
        getTasks();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      console.log(id);
      const response = await api.delete(`/tasks/${id}`);
      if (response.status === 200) {
        getTasks();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const completedTasksCount = todoList.filter((item) => item.isComplete).length;
  const allTasksCompleted =
    todoList.length > 0 && completedTasksCount === todoList.length;

  useEffect(() => {
    if (allTasksCompleted) {
      triggerConfetti();
    }
  }, [allTasksCompleted]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 400,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#ed6853", "#d1e8d8", "#d0bfdb"],
    });
  };

  return (
    <div className="box">
      <Container className="main-box">
        <h1 className={allTasksCompleted ? "glow" : ""}>⭒ TODO LIST ⭒</h1>{" "}
        {todoList.length > 0 && (
          <h3>
            {completedTasksCount === todoList.length
              ? `All ${completedTasksCount} tasks completed! :D`
              : completedTasksCount > 0
              ? `${completedTasksCount} tasks completed :)`
              : "No tasks completed yet :("}
          </h3>
        )}
        <Container className="small-box">
          <Row className="add-item-row">
            <Col xs={12} sm={10}>
              <input
                type="text"
                placeholder="Enter a task..."
                className="input-box"
                value={todoValue}
                onChange={(event) => setTodoValue(event.target.value)}
              />
            </Col>
            <Col xs={12} sm={2}>
              <button className="button-add" onClick={addTask}>
                Add
              </button>
            </Col>
          </Row>

          <div className="scroll-box">
            <TodoBoard
              todoList={todoList}
              deleteTask={deleteTask}
              taskComplete={taskComplete}
            />
          </div>
        </Container>
      </Container>
    </div>
  );
}

export default App;
