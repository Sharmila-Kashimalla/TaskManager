# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Task Manager (React + FastAPI + MongoDB)

A full-stack task management application built with:

Frontend → React (Vite, inline styling)

Backend → Python with FastAPI

Database → MongoDB (local todo_db with tasks collection)


# Prerequisites:

Before starting, make sure you have installed:

Node.js
 (v18+ recommended)

Python
 (v3.9 or higher)

MongoDB
 (running on mongodb://localhost:27017)

# Install dependencies:
  pip install fastapi uvicorn pymongo pydantic bson 

# Run the FastAPI server:
  uvicorn main:app --reload 

# Backend will run on:
  👉 http://localhost:8000  

# Run frontend development server:
  npm run dev  

# Frontend will run on:
  👉 http://localhost:5173  