const request = require("supertest");
const app = require("../server");

describe("Student Task Management API", () => {

    test("GET /tasks should return a list of tasks", async () => {

        const response = await request(app)
            .get("/tasks");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);

    });

    test("POST /tasks should create a new task", async () => {

        const response = await request(app)
            .post("/tasks")
            .send({
                title: "Automated Test Task",
                description: "Created using Jest and Supertest",
                dueDate: "2026-09-30"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe("Task created successfully");
        expect(response.body.taskId).toBeDefined();

    });

        test("PUT /tasks/:id should update a task", async () => {

        const createResponse = await request(app)
            .post("/tasks")
            .send({
                title: "Task to Update",
                description: "This task will be updated",
                dueDate: "2026-10-01"
            });

        const taskId = createResponse.body.taskId;

        const response = await request(app)
            .put(`/tasks/${taskId}`)
            .send({
                status: "COMPLETED"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Task updated successfully");

    });


    test("DELETE /tasks/:id should delete a task", async () => {

        const createResponse = await request(app)
            .post("/tasks")
            .send({
                title: "Task to Delete",
                description: "This task will be deleted",
                dueDate: "2026-10-02"
            });

        const taskId = createResponse.body.taskId;

        const response = await request(app)
            .delete(`/tasks/${taskId}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Task deleted successfully");

    });
    
   
});