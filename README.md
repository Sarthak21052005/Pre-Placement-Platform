# 🚀 Pre-Placement Platform

## 📌 Project Overview

The **Pre-Placement Platform** is a full-stack web application designed to centralize placement preparation. Students can practice **company-specific coding questions, track performance, and visualize progress — all in one place**.

---

## 🎯 Project Vision

* Single platform for placement preparation
* Company-wise + Topic-wise practice
* Track user performance with analytics
* Eliminate duplicate effort (LeetCode-style tracking)
* (Future) AI-driven recommendations

---

## 🏗️ Tech Stack

### 🔹 Backend

* FastAPI (Python)
* SQLAlchemy ORM
* JWT Authentication

### 🔹 Frontend

* React.js
* Axios
* Monaco Editor
* Recharts (Charts)
* React Calendar Heatmap

### 🔹 Databases

* PostgreSQL → Users, authentication, attempts
* MongoDB → Questions (coding + aptitude)

---

## ⚙️ Backend Architecture

```
backend/
│
├── routes/        # API endpoints
├── schemas/       # Pydantic models
├── models/        # SQLAlchemy models
├── CRUD/          # DB logic
├── core/          # Auth & security
├── database/      # Mongo + PostgreSQL
└── main.py
```

---

## 🎨 Frontend Architecture

```
frontend/
│
├── pages/         # Dashboard, Profile, Settings
├── components/    # Navbar, Cards, Charts
├── services/      # API calls
├── styles/        # CSS
└── constants/     # Editor templates
```

---

## ✅ Features Implemented

### 🔐 Authentication

* User & Admin login/register
* JWT-based authentication
* Role-based access

---

### 👨‍💻 Code Practice System

* Monaco Editor integration
* Multi-language support
* Run & Submit system
* Language templates

---

### 🧠 Question System

* MongoDB-based question storage
* Filter by:

  * Company
  * Topic
  * Difficulty

---

### 📊 Attempts System (🔥 Improved)

* Tracks solved questions
* **Prevents duplicate counting (LeetCode behavior)**
* Stores:

  * user_id
  * question_id
  * difficulty
  * timestamp

---

### 📈 Dashboard Analytics (🔥 NEW)

* Problems solved count
* Difficulty split (Easy/Medium/Hard)
* Topic-wise progress
* Company-wise progress
* Interactive charts (Pie + Bar)

---

### 📅 Profile Activity Heatmap (🔥 NEW)

* GitHub-style submission graph
* Daily activity tracking
* Tooltip support
* Stats:

  * Total submissions
  * Active days
  * 🔥 Streak counter

---

### ⚙️ Admin Panel

* Add/Delete questions
* Manage users
* Full control over platform

---

### ⚙️ Settings (User)

* Update profile
* Change password
* Delete account
* Toast notifications + modals

---

### 🎯 UI/UX Improvements

* Modern dashboard UI
* Smooth animations
* Responsive design
* Clean card-based layout

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

### 📊 Attempts

```
POST /attempts
GET  /attempts/stats/{user_id}
GET  /attempts/heatmap/{user_id}
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

---

## 🧠 Database Design

### PostgreSQL

* Users
* Admins
* Attempts

### MongoDB

* Questions
* Topic & company metadata

---

## 📊 Current Project Status

✅ Full-stack platform working
✅ Dashboard with analytics
✅ Heatmap activity tracking
✅ Unique attempt tracking (no duplicates)
✅ Admin system
✅ Clean UI/UX

🚧 Code execution engine pending
🚧 AI recommendations pending

---

## 🛠️ Upcoming Features

### 🔥 Core

* Code execution (Judge0)
* Test cases system
* Output console

### 📊 Advanced Analytics

* Weak topic detection
* Performance trends

### 🤖 AI Features

* Smart recommendations
* Personalized learning path

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

🪟 Windows
venv\Scripts\activate

🍎 Mac / 🐧 Linux

source venv/bin/activate
pip install -r requirements.txt
```

Create `.env`:

```
DATABASE_URL=postgresql://user:password@localhost/dbname
MONGO_URL=mongodb://localhost:27017
SECRET_KEY=your_secret_key
```

Run:

```
uvicorn main:app --reload
```

---

### 3. Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 💡 Motivation

> "Students waste time switching between platforms."

This platform combines:

**LeetCode + GFG + InterviewBit → into ONE system**

---

## 🏁 Conclusion

The platform has evolved into a **data-driven preparation system** with:

* Real-time analytics
* Activity tracking
* Structured practice

Next phase focuses on **AI-powered learning 🚀**

---

## ⭐ Contribute

Contributions are welcome!
Let’s build the ultimate placement platform 🚀
