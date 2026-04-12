# 🚀 Pre-Placement Platform

## 📌 Project Overview

The **Pre-Placement Platform** is a full-stack web application designed to centralize placement preparation. Students can practice **company-specific coding questions, track progress, and prepare efficiently — all in one place**.

---

## 🎯 Project Vision

* Single platform for placement preparation
* Company-wise question practice
* Track user performance and attempts
* Admin-controlled question management
* (Future) AI-driven recommendations

---

## 🏗️ Tech Stack

### 🔹 Backend

* FastAPI (Python)
* JWT Authentication
* SQLAlchemy ORM

### 🔹 Frontend

* React.js
* Axios
* Monaco Editor (Code Editor)
* React Hot Toast (UI feedback)

### 🔹 Databases

* PostgreSQL → Users, authentication, attempts
* MongoDB → Questions (coding + aptitude)

---

## ⚙️ Backend Architecture

```
backend/
│
├── routes/        # API endpoints (auth, admin, questions, users)
├── schemas/       # Pydantic models
├── models/        # SQLAlchemy models
├── CRUD/          # Database operations
├── core/          # JWT & security logic
├── database/      # MongoDB + PostgreSQL connections
└── main.py        # Entry point
```

---

## 🎨 Frontend Architecture

```
frontend/
│
├── pages/         # Login, Register, Dashboard, Settings, Admin
├── components/    # Navbar, Sidebar, Modals
├── services/      # API calls
├── styles/        # CSS files
└── constants/     # Editor templates
```

---

## ✅ Features Implemented

### 🔐 Authentication

* User & Admin Login/Register
* JWT-based authentication
* Role-based access (user/admin)

---

### 👨‍💻 Code Practice System

* Monaco Editor integration
* Multi-language support
* Auto-save code per question
* Language templates
* Run & Submit functionality

---

### 🧠 Question System

* MongoDB-based question storage
* Filter by:

  * Company
  * Topic
  * Difficulty
* Question detail page with editor

---

### 📊 Attempts System

* Submission tracking
* Stores solved questions
* Linked to user accounts

---

### ⚙️ Admin Panel

* Add questions
* Delete questions
* View users
* Delete users
* Full admin control over platform content

---

### ⚙️ Settings (User)

* Update profile name (JWT-based)
* Change password (secure validation)
* Delete account
* Toast notifications + modal confirmations

---

### 🎯 UI/UX Improvements

* Toast notifications (no alerts)
* Custom confirmation modals (no browser popups)
* Loading states for all actions
* Clean dashboard & editor UI

---

## 🔗 API Endpoints

### 🔐 Auth

```
POST /auth/register
POST /auth/login
PUT  /auth/update-profile
PUT  /auth/change-password
DELETE /auth/delete-account
```

### 📚 Questions

```
GET /questions
GET /questions/{id}
GET /questions/company/{company}
GET /questions/topic/{topic}
GET /questions/difficulty/{difficulty}
```

### 👨‍💼 Admin

```
POST   /admin/login
POST   /admin/register
GET    /admin/questions/all
POST   /admin/questions/add
DELETE /admin/questions/{id}
GET    /admin/users/all
DELETE /admin/users/{id}
```

### 📊 Attempts

```
POST /attempts
```

---

## 🧠 Database Design

### PostgreSQL

Stores:

* Users
* Admins
* Attempts

### MongoDB

Stores:

* Questions
* Metadata (company, topic, difficulty)
* Problem descriptions

---

## 📊 Current Project Status

✅ Full-stack system working
✅ Authentication (User + Admin)
✅ Admin dashboard implemented
✅ Code editor UI completed
✅ Settings page with JWT security
✅ Attempts system working

🚧 Code execution (real compiler) pending
🚧 Performance analytics pending

---

## 🛠️ Upcoming Features

### 🔥 High Priority

* Code execution API (Judge0)
* Test case system
* Output console

### 📊 Analytics

* User performance dashboard
* Attempt history tracking

### 🤖 AI Features

* Question recommendations
* Difficulty adaptation
* Resume-based preparation

---

## 🔄 System Architecture

```
React (Frontend)
        ↓
FastAPI (Backend)
        ↓
PostgreSQL + MongoDB
```

---

## 📦 Installation & Setup

### 1. Clone Repository

```
git clone https://github.com/Sarthak21052005/Pre-Placement-Platform
cd Pre-Placement-Platform
```

---

### 2. Backend Setup

```
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env`:

```
DATABASE_URL=postgresql://user:password@localhost/dbname
MONGO_URL=mongodb://localhost:27017
SECRET_KEY=your_secret_key
```

Run backend:

```
uvicorn main:app --reload
```

---

### 3. Frontend Setup

```
cd frontend
npm install
npm install @monaco-editor/react
npm install react-hot-toast
npm run dev
```

---

## 💡 Motivation

> "Students waste time jumping across platforms for preparation."

This platform solves that by combining:

**LeetCode + InterviewBit + GFG → into one focused placement system**

---

## 🏁 Conclusion

The platform has evolved into a **complete full-stack system** with:

* Authentication
* Admin control
* Code editor
* User management
* Clean UI/UX

Next phase focuses on **real code execution and AI-powered learning** 🚀

---

## ⭐ Contribute

Contributions are welcome!
Let’s build the ultimate placement platform together 🚀
