"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTasks = exports.updateTasks = exports.createTasks = exports.getTaskByIds = exports.getAllTasks = void 0;
const aws_sdk_1 = require("aws-sdk");
const dynamoDB = new aws_sdk_1.DynamoDB.DocumentClient();
const TableName = process.env.DYNAMODB_TABLE || "";
const getAllTasks = async () => {
    const params = { TableName };
    return await dynamoDB.scan(params).promise();
};
exports.getAllTasks = getAllTasks;
const getTaskByIds = async (id) => {
    const params = { TableName, Key: { id } };
    return await dynamoDB.get(params).promise();
};
exports.getTaskByIds = getTaskByIds;
const createTasks = async (task) => {
    const params = {
        TableName,
        Item: task,
    };
    return await dynamoDB.put(params).promise();
};
exports.createTasks = createTasks;
const updateTasks = async (id, updates) => {
    const params = {
        TableName,
        Key: { id },
        UpdateExpression: "set #title = :title, #description = :description, #status = :status",
        ExpressionAttributeNames: {
            "#title": "title",
            "#description": "description",
            "#status": "status",
        },
        ExpressionAttributeValues: {
            ":title": updates.title,
            ":description": updates.description,
            ":status": updates.status,
        },
        ReturnValues: "ALL_NEW",
    };
    return await dynamoDB.update(params).promise();
};
exports.updateTasks = updateTasks;
const deleteTasks = async (id) => {
    const params = { TableName, Key: { id } };
    return await dynamoDB.delete(params).promise();
};
exports.deleteTasks = deleteTasks;
