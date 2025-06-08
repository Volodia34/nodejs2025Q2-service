# Home Library Service

Welcome to the Home Library Service! This service is a RESTful API built with Node.js and the NestJS framework. It allows users to manage a home music library, including creating, reading, updating, and deleting data about Artists, Tracks, and Albums, as well as managing personal lists of Favorites.

## Table of Contents

- [Key Features](#key-features)
- [Requirements](#system-requirements)
- [Downloading the Project](#downloading-the-project)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application-with-docker)
- [API Usage Guide](#api-usage-guide)
    - [Main Resources](#main-resources)
    - [Authentication and Authorization](#authentication-and-authorization)
    - [API Documentation (Swagger/OpenAPI)](#api-documentation-swaggeropenapi)
- [Testing](#testing)
- [Linting and Code Formatting](#linting-and-code-formatting)
- [Debugging](#debugging)

## Key Features

- User management (create, read, update password, delete)
- CRUD operations for Artists, Albums, and Tracks
- Management of favorite tracks, albums, and artists
- JWT-based authentication (Access and Refresh tokens)
- Input data validation
- Detailed API documentation via Swagger (OpenAPI)

## System Requirements

The primary requirement to run this project is Docker.

- **Docker**: You must have Docker and Docker Compose installed. [Download & Install Docker](https://www.docker.com/products/docker-desktop/)
- **Node.js**: Required only if you want to run tests or the application locally without Docker. Recommended version `>=22.14.0`.

## Downloading the Project

```bash
git clone {YOUR_REPOSITORY_URL}
cd nodejs2025Q2-service
```

## Installation

Install all necessary npm packages:

```bash
npm install
```

## Environment Configuration

The application requires a `.env` file in the root directory for configuration.

1.  Create a file named `.env`. It's recommended to copy `.env.example` if it exists.
2.  Fill it with the necessary variables:

    ```env
    PORT=4000

    # PostgreSQL Connection Settings for Docker
    POSTGRES_HOST=postgres-db
    POSTGRES_PORT=5432
    POSTGRES_USER=myuser
    POSTGRES_PASSWORD=mypassword
    POSTGRES_DB=mydatabase

    # JWT Secrets - IMPORTANT: change these to your own secure random strings
    JWT_SECRET_KEY=your-super-secret-key
    JWT_SECRET_REFRESH_KEY=your-super-secret-refresh-key
    TOKEN_EXPIRE_TIME=1h
    TOKEN_REFRESH_EXPIRE_TIME=24h
    ```
> ⚠️ **Note:** The `.env` file should be listed in your `.gitignore` and must not be committed to the repository.

## Running the Application with Docker

This is the recommended way to run the project. It automatically sets up the application and the PostgreSQL database in containers.

1.  **Build and Run Containers**
    Execute the following command in your terminal. This will build the application's Docker image and start both the app and database containers.
    ```bash
    docker-compose up --build
    ```
    To run in the background (detached mode), add the `-d` flag:
    ```bash
    docker-compose up --build -d
    ```

2.  **Stopping the Application**
    To stop and remove the containers, press `Ctrl + C` (if not in detached mode) and then run:
    ```bash
    docker-compose down
    

## API Usage Guide

### Main Resources

- **User** (`/user`): Manage user accounts
- **Track** (`/track`): Manage music tracks
- **Album** (`/album`): Manage albums
- **Artist** (`/artist`): Manage artists
- **Favorites** (`/favs`): Manage favorites

### Authentication and Authorization

Most endpoints are protected and require JWT:

- **Sign Up:**  
  `POST /auth/signup`  
  Send `login` and `password` in the body

- **Login:**  
  `POST /auth/login`  
  Receive `accessToken` and `refreshToken`

- **Access protected endpoints:**  
  Use `Authorization: Bearer YOUR_ACCESS_TOKEN` header

- **Refresh tokens:**  
  `POST /auth/refresh`  
  Send `refreshToken` in the body

Refer to Swagger docs for detailed DTOs and expected responses.

### API Documentation (Swagger/OpenAPI)

Once the application is running via Docker, the interactive API documentation is available at:

-   **URL:** [`http://localhost:4000/doc`](http://localhost:4000/doc)

## Testing

Run tests using the following scripts:

- **Basic e2e tests:**

```bash
npm run test
```

- **Specific test file:**

```bash
npm run test -- <path_to_test_file>
# Example:
npm run test -- test/users.e2e.spec.ts
```

- **Tests with auth (JWT-protected endpoints):**

```bash
npm run test:auth
```

- **Specific auth test:**

```bash
npm run test:auth -- <auth_test_file>
# Example:
npm run test:auth -- test/auth/users.e2e.spec.ts
```

- **Refresh token tests:**

```bash
npm run test:refresh
```

Uses `supertest` and `jest`.

## Linting and Code Formatting

Ensure code quality using:

- **ESLint:**

```bash
npm run lint
```

- **Prettier:**

```bash
npm run format
```

Run before committing.

## Debugging

If you're using **Visual Studio Code**, press <kbd>F5</kbd> to start a debug session (requires `launch.json` config).

[VSCode Debugging Documentation](https://code.visualstudio.com/docs/editor/debugging)

