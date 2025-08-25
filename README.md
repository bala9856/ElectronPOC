# Electron React CRUD Application

A desktop application built with Electron, React, Material-UI, and SQLite for CRUD operations.

## Features

- **Electron**: Desktop application framework
- **React**: Frontend UI library
- **Material-UI**: Modern React UI components
- **SQLite**: Local database for data persistence
- **CRUD Operations**: Create, Read, Update, Delete users

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

### Running the Application

#### Development Mode
```bash
npm run dev
```
This will start both the React development server and Electron app.

#### Production Mode
```bash
npm run build
npm start
```

## Application Structure

```
src/
├── main.js          # Electron main process
├── preload.js       # Preload script for secure IPC
├── index.js         # React entry point
└── App.js           # Main React component

public/
└── index.html       # HTML template

database.db          # SQLite database (created automatically)
```

## Usage

1. **Add User**: Click the "Add User" button to create a new user
2. **Edit User**: Click the edit icon next to any user to modify their information
3. **Delete User**: Click the delete icon to remove a user
4. **View Users**: All users are displayed in the table

## Database Schema

The application uses a simple `users` table with the following structure:

- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `name` (TEXT NOT NULL)
- `email` (TEXT NOT NULL)
- `age` (INTEGER)

## Scripts

- `npm run dev` - Start development mode
- `npm start` - Start production mode
- `npm run build` - Build React app for production
- `npm run pack` - Package the app with electron-builder