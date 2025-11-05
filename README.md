# Notes App (MERN Stack)

## Project Overview
The **Notes App** is a full-stack web application that enables users to **create**, **edit**, and **delete** personal notes securely.  
Built with a modern tech stack, it features **user authentication**, **structured logging**, **robust error handling**, **automated testing**, and **database management** with **PostgreSQL**.  

The goal of this project is to deliver a **responsive**, **scalable**, and **maintainable** system for seamless note-taking.

---

## Technology Stack

| Category | Technologies Used |
|-----------|------------------|
| **Frontend** | React.js |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL |
| **Logging** | Pino Logger |
| **Testing** | Mocha / Chai (Backend), Jest (Frontend) |
| **Code Quality** | SonarQube |
| **Version Control** | Git / GitHub |

---

## ✨ Key Features

### User Authentication & Authorization
- Secure sign-up, login, and logout functionality.
- Each note is tied to a specific authenticated user.

###  Note Management
- Create, edit, and delete notes.
- Supports **rich text editing** for improved user experience.

### Application Logging
- Centralized logging using **Pino Logger**.
- Tracks events, API calls, errors, and user actions for better observability.

### Exception Handling
- Global error-handling middleware in Express.
- Provides descriptive error responses.
- Integrates with Pino Logger for error tracking.

### Unit Testing
- **Backend:** Mocha + Chai tests for controllers, services, and DB operations.
- **Frontend:** Jest tests for React components and utilities.

### Code Quality with SonarQube
- Automated static analysis for both frontend and backend.
- Identifies code smells, vulnerabilities, and duplication.

### React Frontend
- Clean, modern, and responsive UI.
- Dashboard view for managing notes and user profile.
- Smooth navigation using React Router.

### Git Version Control
- Managed through **Git & GitHub**.
- Implements structured branching and merging strategy.

---

## Application Flow

### 1. Sign Up / Log In
**Components**
- Sign-Up Form  
- Login Form  

**Operations**
- Registers a new user.  
- Authenticates and redirects to Dashboard.

---

### 2. Dashboard (Notes List)
**Components**
- User’s notes list  
- “Create Note” button  

**Operations**
- Fetches notes via API.  
- Displays user-specific notes.  
- Allows navigation to the editor.

---

### 3. Note Editor
**Components**
- Rich text editor  
- Save / Cancel buttons  

**Operations**
- Create new or edit existing notes.  
- Saves data to backend and returns to Dashboard.

---

### 4. User Profile (Optional)
**Components**
- User details display  
- Logout button  

**Operations**
- Shows profile data.  
- Logs out the user securely.

---

## Installation Guide

### 🪄 1. Clone the Repository
```bash
git clone https://github.com/dileep1319/dileep-mern-10pshine.git
```

### 2. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Run the Application
```bash
# Start backend server
cd backend
npm start

cd ../frontend
npm run dev
```

### 4. Run Tests
```bash
cd backend
npm test

cd ../frontend
npm test
```


## 💡 Author
**👨‍💻 Dileep Kumar**  
Full Stack Developer | MERN | DevOps | Cloud Enthusiast  
🔗 [GitHub](https://github.com/dileep1319)

---

> _"Organize your thoughts. Build your ideas. One note at a time."_ ✨
