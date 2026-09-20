const express = require("express");
const db = require("./database");

const app = express();

const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("Student Task Management System is running!");
});

app.post("/tasks", (req, res) => {
    const { title, description, dueDate } = req.body;

    if (!title) {
        return res.status(400).json({
            error: "Task title is required"
        });
    }

    const statement = db.prepare(`
        INSERT INTO tasks (title, description, dueDate)
        VALUES (?, ?, ?)
    `);

    const result = statement.run(
        title,
        description || "",
        dueDate || ""
    );

    res.status(201).json({
        message: "Task created successfully",
        taskId: result.lastInsertRowid
    });
});
app.get("/tasks", (req, res) => {
    const tasks = db.prepare("SELECT * FROM tasks ORDER BY id DESC").all();

    res.json(tasks);
});
app.put("/tasks/:id", (req, res) => {
    const { title, description, dueDate, status } = req.body;
    const { id } = req.params;

    const existingTask = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);

    if (!existingTask) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    const statement = db.prepare(`
        UPDATE tasks
        SET title = ?, description = ?, dueDate = ?, status = ?
        WHERE id = ?
    `);

    statement.run(
        title || existingTask.title,
        description ?? existingTask.description,
        dueDate ?? existingTask.dueDate,
        status || existingTask.status,
        id
    );

    res.json({
        message: "Task updated successfully"
    });
});
app.delete("/tasks/:id", (req, res) => {
    const { id } = req.params;

    const existingTask = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);

    if (!existingTask) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    db.prepare("DELETE FROM tasks WHERE id = ?").run(id);

    res.json({
        message: "Task deleted successfully"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});