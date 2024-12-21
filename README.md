# prueba Task CRUD Lambda
Prueba Crud Tareas con Lambda

## Endpoints

### Crear tarea
`POST`  
[https://3s8aof75v0.execute-api.us-east-1.amazonaws.com/dev/tasks](https://3s8aof75v0.execute-api.us-east-1.amazonaws.com/dev/tasks)

---

### Editar tarea
`PUT`  
[https://3s8aof75v0.execute-api.us-east-1.amazonaws.com/dev/tasks/{id}](https://3s8aof75v0.execute-api.us-east-1.amazonaws.com/dev/tasks/{id})  
**Nota:** Reemplaza `{id}` con el ID de la tarea que deseas editar.

---

### Mostrar tareas
`GET`  
[https://3s8aof75v0.execute-api.us-east-1.amazonaws.com/dev/tasks](https://3s8aof75v0.execute-api.us-east-1.amazonaws.com/dev/tasks)

---

### Mostrar tarea por ID
`GET`  
[https://3s8aof75v0.execute-api.us-east-1.amazonaws.com/dev/tasks/{id}](https://3s8aof75v0.execute-api.us-east-1.amazonaws.com/dev/tasks/{id})  
**Nota:** Reemplaza `{id}` con el ID de la tarea que deseas consultar.

---

### Eliminar tarea
`DELETE`  
[https://3s8aof75v0.execute-api.us-east-1.amazonaws.com/dev/tasks/{id}](https://3s8aof75v0.execute-api.us-east-1.amazonaws.com/dev/tasks/{id})  
**Nota:** Reemplaza `{id}` con el ID de la tarea que deseas eliminar.

---

## Dependencias

### aws-sdk
Biblioteca oficial de AWS utilizada para interactuar con servicios como DynamoDB, S3, y otros.

### serverless
Framework para gestionar y desplegar funciones Lambda junto con la infraestructura asociada.

### typescript
Lenguaje de programación tipado que mejora la experiencia de desarrollo en JavaScript.

### mocha
Framework para realizar pruebas unitarias y garantizar la calidad del código.

### chai
Librería de aserciones utilizada junto con Mocha para validar resultados en pruebas.

### uuid
Librería utilizada para generar identificadores únicos, ideal para asignar IDs a las tareas.

### dotenv
Librería para gestionar variables de entorno desde un archivo .env de forma segura.

### @types/aws-lambda
Definiciones de tipo para facilitar el desarrollo con AWS Lambda en TypeScript.


