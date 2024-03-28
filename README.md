# Library Book API

Stacks: TypeScript, Express, PostgresSQL, PrismaORM, Jest.

Endpoints: With swagger-autogen all endpoints will be available at your_api_url/api-docs.

## Configuration

Set up the env file based on the .env.example.

## Installation

```
$ npm install
```

```
$ docker compose up --build -d
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

Repositories

- src/repositories: Queries to the database (CRUD)

Routes

- src/routes: Our endpoints paths

Tests:

- src/tests: Entities test
