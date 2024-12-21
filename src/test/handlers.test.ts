import { expect } from 'chai';
import sinon from 'sinon';
import { APIGatewayProxyEvent, Context, Callback, APIGatewayProxyResult } from 'aws-lambda';
import { getTasks, getTask, createTask, updateTask, deleteTask } from '../infrastructure/handlers';
import { getAllTasks, getTaskByIds, createTasks, updateTasks, deleteTasks } from '../infrastructure/dynamo';
import { Task } from '../domain/task';
import { generateUniqueId } from '../utils/generateId';

describe("Task Lambda Functions", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("getTasks", () => {
    it("debe devolver una lista vacía si no hay tareas", async () => {
      sinon.stub(getAllTasks as any).resolves({ Items: undefined });

      const event: APIGatewayProxyEvent = {} as any;
      const context: Context = {} as any;
      const callback: Callback<APIGatewayProxyResult> = () => {};
      const response = await getTasks(event, context, callback);

      if (response && 'body' in response) {
        expect(response.statusCode).to.equal(200);
        expect(JSON.parse(response.body)).to.deep.equal([]);
      }
    });

    it("debe devolver una lista de tareas si existen", async () => {
      const mockTasks = [
        { id: "1", title: "Task 1", description: "Description 1", status: false },
        { id: "2", title: "Task 2", description: "Description 2", status: true },
      ];
      sinon.stub(getAllTasks as any).resolves({ Items: mockTasks });

      const event: APIGatewayProxyEvent = {} as any;
      const context: Context = {} as any;
      const callback: Callback<APIGatewayProxyResult> = () => {};
      const response = await getTasks(event, context, callback);

      if (response && 'body' in response) {
        expect(response.statusCode).to.equal(200);
        expect(JSON.parse(response.body)).to.deep.equal(
          mockTasks.map(item => new Task(item.id, item.title, item.description, item.status))
        );
      }
    });
  });

  describe("getTask", () => {
    it("debe devolver un error si no se proporciona un id", async () => {
      const event: APIGatewayProxyEvent = { pathParameters: {} } as any;
      const context: Context = {} as any;
      const callback: Callback<APIGatewayProxyResult> = () => {};
      const response = await getTask(event, context, callback);

      if (response && 'body' in response) {
        expect(response.statusCode).to.equal(400);
        expect(JSON.parse(response.body).message).to.equal("Task ID is required");
      }
    });

    it("debe devolver un error si la tarea no se encuentra", async () => {
      sinon.stub(getTaskByIds as any).resolves({ Item: undefined });

      const event: APIGatewayProxyEvent = { pathParameters: { id: "1" } } as any;
      const context: Context = {} as any;
      const callback: Callback<APIGatewayProxyResult> = () => {};
      const response = await getTask(event, context, callback);

      if (response && 'body' in response) {
        expect(response.statusCode).to.equal(404);
        expect(JSON.parse(response.body).message).to.equal("Task not found");
      }
    });

    it("debe devolver la tarea si existe", async () => {
      const mockTask = { id: "1", title: "Task 1", description: "Description 1", status: false };
      sinon.stub(getTaskByIds as any).resolves({ Item: mockTask });

      const event: APIGatewayProxyEvent = { pathParameters: { id: "1" } } as any;
      const context: Context = {} as any;
      const callback: Callback<APIGatewayProxyResult> = () => {};
      const response = await getTask(event, context, callback);

      if (response && 'body' in response) {
        expect(response.statusCode).to.equal(200);
        expect(JSON.parse(response.body)).to.deep.equal(new Task(mockTask.id, mockTask.title, mockTask.description, mockTask.status));
      }
    });
  });

  describe("createTask", () => {
    it("debe devolver un error si faltan campos obligatorios", async () => {
      const event: APIGatewayProxyEvent = { body: JSON.stringify({ title: "", description: "" }) } as any;
      const context: Context = {} as any;
      const callback: Callback<APIGatewayProxyResult> = () => {};
      const response = await createTask(event, context, callback);

      if (response && 'body' in response) {
        expect(response.statusCode).to.equal(400);
        expect(JSON.parse(response.body).message).to.equal("Title and Description are required");
      }
    });

    it("debe crear una tarea y devolverla", async () => {
      const mockId = "unique-id";
      const mockTask = { title: "Task 1", description: "Description 1" };

      sinon.stub(generateUniqueId as any).returns(mockId);
      sinon.stub(createTasks as any).resolves();

      const event: APIGatewayProxyEvent = { body: JSON.stringify(mockTask) } as any;
      const context: Context = {} as any;
      const callback: Callback<APIGatewayProxyResult> = () => {};
      const response = await createTask(event, context, callback);

      if (response && 'body' in response) {
        expect(response.statusCode).to.equal(201);
        expect(JSON.parse(response.body)).to.deep.equal(new Task(mockId, mockTask.title, mockTask.description, false));
      }
    });
  });

  describe("updateTask", () => {
    it("debe devolver un error si faltan campos", async () => {
      const event: APIGatewayProxyEvent = { pathParameters: {}, body: JSON.stringify({}) } as any;
      const context: Context = {} as any;
      const callback: Callback<APIGatewayProxyResult> = () => {};
      const response = await updateTask(event, context, callback);

      if (response && 'body' in response) {
        expect(response.statusCode).to.equal(400);
        expect(JSON.parse(response.body).message).to.equal("Task ID is required");
      }
    });

    it("debe actualizar una tarea y devolverla", async () => {
      const mockUpdatedTask = { id: "1", title: "Updated Task", description: "Updated Description", status: true };
      sinon.stub(updateTasks as any).resolves({ Attributes: mockUpdatedTask });

      const event: APIGatewayProxyEvent = {
        pathParameters: { id: "1" },
        body: JSON.stringify({ title: "Updated Task", description: "Updated Description", status: true })
      } as any;
      const context: Context = {} as any;
      const callback: Callback<APIGatewayProxyResult> = () => {};
      const response = await updateTask(event, context, callback);

      if (response && 'body' in response) {
        expect(response.statusCode).to.equal(200);
        expect(JSON.parse(response.body)).to.deep.equal(new Task(mockUpdatedTask.id, mockUpdatedTask.title, mockUpdatedTask.description, mockUpdatedTask.status));
      }
    });
  });

  describe("deleteTask", () => {
    it("debe devolver un error si no se proporciona un id", async () => {
      const event: APIGatewayProxyEvent = { pathParameters: {} } as any;
      const context: Context = {} as any;
      const callback: Callback<APIGatewayProxyResult> = () => {};
      const response = await deleteTask(event, context, callback);

      if (response && 'body' in response) {
        expect(response.statusCode).to.equal(400);
        expect(JSON.parse(response.body).message).to.equal("Task ID is required");
      }
    });

    it("debe eliminar una tarea", async () => {
      sinon.stub(deleteTasks as any).resolves();

      const event: APIGatewayProxyEvent = { pathParameters: { id: "1" } } as any;
      const context: Context = {} as any;
      const callback: Callback<APIGatewayProxyResult> = () => {};
      const response = await deleteTask(event, context, callback);

      if (response && 'body' in response) {
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.equal("La tarea ha sido eliminada");
      }
    });
  });
});
