"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTask = exports.getTasks = void 0;
const dynamo_1 = require("./dynamo");
const task_1 = require("../domain/task");
const generateId_1 = require("../utils/generateId");
const getTasks = async () => {
    const result = await (0, dynamo_1.getAllTasks)();
    // Validar si result.Items existe antes de mapear
    const tasks = result.Items
        ? result.Items.map((item) => new task_1.Task(item.id, item.title, item.description, item.status))
        : [];
    return {
        statusCode: 200,
        body: JSON.stringify(tasks),
    };
};
exports.getTasks = getTasks;
const getTask = async (event) => {
    var _a;
    const id = (_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.id;
    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Id es requerido" }),
        };
    }
    const result = await (0, dynamo_1.getTaskByIds)(id);
    if (!result.Item) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: "Tarea no encontrada" }),
        };
    }
    // Convertir la tarea recuperada en una instancia de Task
    const task = new task_1.Task(result.Item.id, result.Item.title, result.Item.description, result.Item.status);
    return {
        statusCode: 200,
        body: JSON.stringify(task),
    };
};
exports.getTask = getTask;
const createTask = async (event) => {
    const { title, description } = JSON.parse(event.body || "{}");
    // Validación de entrada
    if (!title || !description) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Title y Description es requerido" }),
        };
    }
    // Generar ID único y crear la nueva tarea
    const task = new task_1.Task((0, generateId_1.generateUniqueId)(), title, description, false);
    await (0, dynamo_1.createTasks)(task);
    return {
        statusCode: 201,
        body: JSON.stringify(task),
    };
};
exports.createTask = createTask;
const updateTask = async (event) => {
    var _a;
    const id = (_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.id;
    const updates = JSON.parse(event.body || "{}");
    // Validación de entrada
    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Id de tarea es requerido" }),
        };
    }
    if (!updates.title || !updates.description || updates.status === undefined) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Title, Description, y status son requeridos" }),
        };
    }
    // Crear una nueva instancia de Task con los datos actualizados
    const updatedTaskData = new task_1.Task(id, updates.title, updates.description, updates.status);
    // Actualizar tarea en DynamoDB
    const updatedResult = await (0, dynamo_1.updateTasks)(id, updates);
    // Validar si updatedResult.Attributes existe antes de usar
    if (!updatedResult.Attributes) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error al actualizar la tarea" }),
        };
    }
    // Convertir los resultados actualizados en una instancia de Task
    const updatedTask = new task_1.Task(updatedResult.Attributes.id, updatedResult.Attributes.title, updatedResult.Attributes.description, updatedResult.Attributes.status);
    return {
        statusCode: 200,
        body: JSON.stringify(updatedTask),
    };
};
exports.updateTask = updateTask;
const deleteTask = async (event) => {
    var _a;
    const id = (_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.id;
    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Id es requerido" }),
        };
    }
    await (0, dynamo_1.deleteTasks)(id);
    return {
        statusCode: 200,
        body: "Tarea eliminada exitosamente",
    };
};
exports.deleteTask = deleteTask;
