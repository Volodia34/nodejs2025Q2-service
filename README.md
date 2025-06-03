# Home Library Service

Welcome to the Home Library Service! This service is a RESTful API built with Node.js and the NestJS framework. It allows users to manage a home music library, including creating, reading, updating, and deleting data about Artists, Tracks, and Albums, as well as managing personal lists of Favorites.

## Table of Contents

- [Key Features](#key-features)
- [Prerequisites](#prerequisites)
- [Downloading the Project](#downloading-the-project)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
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

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Git**: You'll need Git to clone the repository. [Download & Install Git](https://git-scm.com/downloads)
- **Node.js**: Required to run the application
    - Recommended version: `>=22.14.0` (as specified in the `engines` field in `package.json`)
    - [Download & Install Node.js](https://nodejs.org/en/download/)

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

The application uses environment variables for configuration, loaded from a `.env` file.

1. In the root directory of the project, create a file named `.env`.
2. Add the required environment variables. For example:

```env
PORT=4000
```

If not specified, the service will default to port `4000`.

> ⚠️ Do **not** commit the `.env` file to version control. Ensure it's in your `.gitignore`.

## Running the Application

Available scripts:

- **Development mode (with hot-reload):**

```bash
npm run start:dev
```

- **Standard start (NestJS default):**

```bash
npm start
```

- **Production mode:**

```bash
npm run build
npm run start:prod
```

The app will run at e.g., `http://localhost:4000`.

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

Interactive Swagger documentation is available at:

```
http://localhost:PORT/doc/
```

Example: `http://localhost:4000/doc/`

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

