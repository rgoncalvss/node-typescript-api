# Library Book API

Stacks: TypeScript, Express, PostgresSQL, PrismaORM.

## Configuration

Set up the env file based on the .env.example.

## Installation

```
$ npm install
```

```
$ docker compose up --build -d
```

```
$ npx prisma migrate dev --name init
```

# Running the app

## Development

```
$ npm run dev
```

## Unit tests

```
$ npm run test
```

## Architecture:

Controller

- src/controllers/: Create the controller to handle the business logic

Exceptions

- src/exceptions: HTTP exceptions

Interfaces

- src/interfaces: Entities interface

Middlewares

- src/middlewares: Helps validate data and errors handling between requisitions.

Models

- src/models: Queries to the database (CRUD)

Routes

- src/routes: Our endpoints paths

Tests:

- src/tests: Entities test
