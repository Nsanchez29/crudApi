import { DynamoDB } from "aws-sdk";
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const dynamoDB = new DynamoDB.DocumentClient();
const TableName = process.env.DYNAMODB_TABLE || "";

export const getAllTasks = async () => {
  const params = { TableName };
  return await dynamoDB.scan(params).promise();
};

export const getTaskByIds = async (id: string) => {
  const params = { TableName, Key: { id } };
  return await dynamoDB.get(params).promise();
};

export const createTasks = async (task: any) => {
    const params = {
      TableName,
      Item: task,
    };
    return await dynamoDB.put(params).promise();
  };

  export const updateTasks = async (id: string, updates: any) => {
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

export const deleteTasks = async (id: string) => {
  const params = { TableName, Key: { id } };
  return await dynamoDB.delete(params).promise();
};
