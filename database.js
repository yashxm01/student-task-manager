const Database = require("better-sqlite3");

const db = new Database("tasks.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        dueDate TEXT,
        status TEXT DEFAULT 'PENDING'
    )
`);

console.log("Database connected successfully!");

module.exports = db;