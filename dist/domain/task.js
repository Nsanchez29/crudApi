"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
class Task {
    constructor(id, title, description, status = false) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
    }
}
exports.Task = Task;
