# 🚀 Pre-Placement Platform

## 📌 Project Overview

The **Pre-Placement Platform** is a centralized web application designed to help students prepare for campus placements efficiently. Instead of switching between multiple websites, students can access **company-specific coding and aptitude questions** in one place.

---

## 🎯 Project Vision

* Provide a **single platform** for placement preparation
* Offer **company-specific question sets**
* Enable **performance tracking and analytics**
* (Future) Add **AI-based recommendations and adaptive learning**

---

## 🏗️ Tech Stack

### Backend

* FastAPI (Python)
* JWT Authentication

### Frontend (Planned)

* React.js

### Databases

* PostgreSQL → Users, authentication, attempts, analytics
* MongoDB → Questions (coding + aptitude)

### Future Additions

* Judge0 → Code execution
* Vector Database → Embeddings & similarity search
* Basic Language Model

---

## ⚙️ Backend Architecture

```
backend/
│
├── routes/        # API endpoints
├── schemas/       # Pydantic models
├── models/        # SQLAlchemy models
├── CRUD/          # Database operations
├── core/          # JWT & security logic
├── database/      # DB connections (MongoDB + PostgreSQL)
└── main.py        # Entry point
```

---

## ✅ Features Implemented (Backend)

### 🔐 Authentication

* User Registration API
* User Login API
* JWT-based authentication system

### 🗄️ Database Integration

* PostgreSQL connected successfully
* MongoDB connected successfully

### 📚 Question System

* Questions stored in MongoDB
* Company-specific dataset (e.g., Amazon)
* APIs to fetch questions by filters

---

## 🔗 Available API Endpoints

### Authentication

```
POST /register
POST /login
```

### Questions

```
GET /questions
GET /questions/{question_id}
GET /questions/company/{company}
GET /questions/topic/{topic}
GET /questions/difficulty/{difficulty}
```

---

## 🧠 Database Design

### PostgreSQL (Relational)

Stores:

* Users
* Authentication data
* (Future) Attempts & performance tracking

### MongoDB (NoSQL)

Stores:

* Questions
* Metadata (company, topic, difficulty)
* Solutions & hints

---

## 📊 Current Project Status

✅ Backend foundation is **fully functional**
✅ Authentication system implemented
✅ Question APIs working
✅ Database connections established

🚧 Frontend development **not started yet**
🚧 Submission system **not implemented yet**
🚧 Performance tracking **pending**

---

## 🛠️ Upcoming Features

### Backend

* Attempts table (PostgreSQL)
* Submission API
* Judge0 integration (code execution)
* Performance dashboard API

### Frontend (React)

* Login Page
* Register Page
* Question List Page
* Question Detail Page
* Code editor UI (later phase)

---

## 🧩 Future AI Features

* Question embeddings (vector DB)
* Similar question recommendations
* AI-generated question variations
* Adaptive difficulty system

---

## 🧑‍💻 Development Roadmap

1. Backend APIs (Completed ✅)
2. PostgreSQL integration (Completed ✅)
3. Authentication system (Completed ✅)
4. MongoDB question storage (Completed ✅)
5. Frontend (React) (Next 🔜)
6. Submission system (Upcoming)
7. AI integration (Future 🚀)

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

### 2. Create Virtual Environment

```
python -m venv venv
venv\Scripts\activate   # Windows Users
. venv\bin\activate     # Mac Users 
```

### 3. Install Dependencies

```
pip install -r requirements.txt
```

### 4. Setup Environment Variables

Create `.env` file:

```
DATABASE_URL=postgresql://user:password@localhost/dbname
MONGO_URL=mongodb://localhost:27017
SECRET_KEY=your_secret_key
```

### 5. Run Backend Server

```
uvicorn main:app --reload
```

---

## 📌 Future Scope

* Company-wise preparation dashboards
* Interview experience section
* Resume-based question recommendations
* Real-time coding contests

---

## 💡 Motivation

This project aims to solve a real problem faced by students:

> "Too many platforms, scattered preparation."

By centralizing everything, we aim to create a **LeetCode + InterviewBit + GFG hybrid platform tailored for college placements**.

---

## 🏁 Conclusion

The backend system is now **ready and scalable**, and the project is entering the **frontend development phase**, followed by advanced features like **submission tracking and AI-based personalization**.

---

## ⭐ Contribute

Feel free to contribute and improve this project!

---
