import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// In-memory data store (for demo only)
let nextId = 3;
let todos = [
  { id: 1, task: "Learn REST API", done: false },
  { id: 2, task: "Build a project", done: false },
];

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// GET all todos
app.get("/todos", (_req, res) => {
  res.json(todos);
});

// GET one todo by id
app.get("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find((t) => t.id === id);
  if (!todo) return res.status(404).json({ error: "Todo not found" });
  res.json(todo);
});

// POST create todo
app.post("/todos", (req, res) => {
  const { task } = req.body || {};
  if (!task || typeof task !== "string" || !task.trim()) {
    return res.status(400).json({ error: "Field 'task' (non-empty string) is required" });
  }
  const newTodo = { id: nextId++, task: task.trim(), done: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT update todo
app.put("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find((t) => t.id === id);
  if (!todo) return res.status(404).json({ error: "Todo not found" });

  const { task, done } = req.body || {};
  if (task !== undefined) {
    if (typeof task !== "string" || !task.trim()) {
      return res.status(400).json({ error: "If provided, 'task' must be a non-empty string" });
    }
    todo.task = task.trim();
  }
  if (done !== undefined) {
    if (typeof done !== "boolean") {
      return res.status(400).json({ error: "If provided, 'done' must be boolean" });
    }
    todo.done = done;
  }

  res.json(todo);
});

// DELETE todo
app.delete("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) return res.status(404).json({ error: "Todo not found" });

  const [deleted] = todos.splice(index, 1);
  res.json(deleted);
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

