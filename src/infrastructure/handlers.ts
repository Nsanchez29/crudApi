import { APIGatewayProxyHandler } from "aws-lambda";
import { getAllTasks, getTaskByIds, createTasks, updateTasks, deleteTasks } from "./dynamo";
import { Task } from "../domain/task";
import { generateUniqueId } from "../utils/generateId";

export const getTasks: APIGatewayProxyHandler = async () => {
    const result = await getAllTasks();
  
    // Validar si result.Items existe antes de mapear
    const tasks = result.Items
      ? result.Items.map(
          (item: any) => new Task(item.id, item.title, item.description, item.status)
        )
      : [];
  
    return {
      statusCode: 200,
      body: JSON.stringify(tasks),
    };
  };
  

export const getTask: APIGatewayProxyHandler = async (event) => {
  const id = event.pathParameters?.id;
  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Id es requerido" }),
    };
  }

  const result = await getTaskByIds(id);
  if (!result.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Tarea no encontrada" }),
    };
  }

  // Convertir la tarea recuperada en una instancia de Task
  const task = new Task(
    result.Item.id,
    result.Item.title,
    result.Item.description,
    result.Item.status
  );

  return {
    statusCode: 200,
    body: JSON.stringify(task),
  };
};

export const createTask: APIGatewayProxyHandler = async (event) => {
  const { title, description } = JSON.parse(event.body || "{}");

  // Validación de entrada
  if (!title || !description) {
      return {
          statusCode: 400,
          body: JSON.stringify({ message: "Title y Description es requerido" }),
      };
  }

  // Generar ID único y crear la nueva tarea
  const task = new Task(generateUniqueId(), title, description, false);

  await createTasks(task);

  return {
      statusCode: 201,
      body: JSON.stringify(task),
  };
};

export const updateTask: APIGatewayProxyHandler = async (event) => {
  const id = event.pathParameters?.id;
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
  const updatedTaskData = new Task(id, updates.title, updates.description, updates.status);

  // Actualizar tarea en DynamoDB
  const updatedResult = await updateTasks(id, updates);

    // Validar si updatedResult.Attributes existe antes de usar
    if (!updatedResult.Attributes) {
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "Error al actualizar la tarea" }),
        };
      }

  // Convertir los resultados actualizados en una instancia de Task
  const updatedTask = new Task(
    updatedResult.Attributes.id,
    updatedResult.Attributes.title,
    updatedResult.Attributes.description,
    updatedResult.Attributes.status
  );

  return {
    statusCode: 200,
    body: JSON.stringify(updatedTask),
  };
};

export const deleteTask: APIGatewayProxyHandler = async (event) => {
  const id = event.pathParameters?.id;

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Id es requerido" }),
    };
  }

  await deleteTasks(id);

  return {
    statusCode: 200,
    body: "Tarea eliminada exitosamente",
  };
};
