# 🚀 Pre-Placement Platform

## 📌 Project Overview

The **Pre-Placement Platform** is a full-stack web application designed to centralize placement preparation. Students can practice **company-specific coding questions, execute code, submit solutions, and track performance — all in one place**.

It combines features inspired by **LeetCode + GFG + InterviewBit** into a unified, data-driven system.

---

## 🎯 Project Vision

- Single platform for placement preparation  
- Company-wise + Topic-wise structured practice  
- Real-time performance tracking with analytics  
- Competitive environment with leaderboard  
- (Future) AI-driven personalized learning  

---

## 🏗️ Tech Stack

### 🔹 Backend
- FastAPI (Python)
- SQLAlchemy ORM
- JWT Authentication

### 🔹 Frontend
- React.js
- Axios
- Monaco Editor
- Recharts (Charts)
- React Calendar Heatmap

### 🔹 Databases
- PostgreSQL → Users, Attempts, Analytics  
- MongoDB → Questions, Metadata  

---

## ⚙️ Core Features Implemented

### 🔐 Authentication & Security
- JWT-based authentication
- Role-based access (User/Admin)
- Protected API routes
- Secure password handling

---

### 👨‍💻 Code Execution System (🔥 NEW)

- Integrated **Judge0 via RapidAPI**
- Supports multiple languages (C++, Python, Java)
- Two modes:
  - **Run** → executes visible test cases
  - **Submit** → executes all test cases (including hidden)

---

### 🧠 Question System
- MongoDB-based question storage
- Filter by:
  - Company
  - Topic
  - Difficulty
- Hidden + visible test cases support

---

### 📊 Attempts System (🔥 UPGRADED)

- Tracks every submission
- Uses **verdict-based system**:
  - `Accepted`
  - `Wrong Answer`
  - `Runtime Error`
- Prevents duplicate counting (LeetCode behavior)
- Handles multiple attempts intelligently

---

### 🏆 Leaderboard System (🔥 NEW)

- Ranks users based on:
  - Problems solved
  - Accuracy
- Handles duplicate attempts correctly
- Competitive ranking system (LeetCode-style)

---

### 📈 Dashboard Analytics

- Total problems solved
- Difficulty distribution
- Topic-wise breakdown
- Company-wise progress
- Accuracy tracking

---

### 📅 Activity Heatmap

- GitHub-style submission graph
- Daily activity tracking
- Streak tracking system

---

## ⚡ Judge0 Integration (RapidAPI)

### 🔹 What is Judge0?

Judge0 is an **online code execution engine** that compiles and runs code in a secure sandbox.

---

### 🔹 How We Used It

We integrated Judge0 using **RapidAPI**:

- Backend sends code → Judge0 API  
- Judge0 executes code securely  
- Returns:
  - Output
  - Errors
  - Execution status  

---

### 🔹 Flow

User Code → FastAPI → Judge0 (RapidAPI) → Result → Backend → Frontend


---

### 🔹 Why RapidAPI?

- No need to self-host initially  
- Quick integration  
- Reliable execution environment  

---

## 🔐 Security Measures (VERY IMPORTANT)

### ✅ API Security
- JWT authentication for all protected routes  
- Role-based authorization  

### ✅ Code Execution Safety
- Code executed in Judge0 sandbox (not locally)  
- Prevents system-level attacks  

### ✅ Data Validation
- Strict Pydantic schema validation  

### ✅ Hidden Test Cases
- Hidden inputs/outputs never exposed  
- Prevents cheating  

### ✅ Backend Protection
- No direct DB access from frontend  
- Controlled API layer  

---

## 🧠 Database Design

### PostgreSQL
- Users
- Attempts (verdict-based tracking)
- Analytics

### MongoDB
- Questions
- Topics
- Company metadata
- Test cases

---

## 📊 System Architecture

React (Frontend)
↓
FastAPI (Backend)
↓
PostgreSQL + MongoDB
↓
Judge0 (RapidAPI)

---

## 📦 Installation & Setup

### 1. Clone Repository

git clone https://github.com/Sarthak21052005/Pre-Placement-Platform
cd Pre-Placement-Platform

---

### 2. Backend Setup

python -m venv venv

Windows

venv\Scripts\activate

Mac/Linux

source venv/bin/activate

pip install -r requirements.txt


Create `.env`:

DATABASE_URL=postgresql://user:password@localhost/dbname
MONGO_URL=mongodb://localhost:27017
SECRET_KEY=your_secret_key
JUDGE0_API_KEY=your_rapidapi_key


Run backend:


---

### 3. Frontend Setup

cd frontend
npm install
npm run dev


---

## 📊 Current Project Status

- ✅ Full-stack platform working  
- ✅ Judge0 integration complete  
- ✅ Leaderboard system implemented  
- ✅ Dashboard analytics working  
- ✅ Heatmap + streak tracking  
- ✅ Secure execution pipeline  

---

## 🚀 Future Scope

### 🔥 Self-Hosting Judge0
- Replace RapidAPI with self-hosted Judge0 (Docker)
- Faster and cost-efficient

---

### 🤖 AI Integration (LLMs)
- Personalized recommendations  
- Question generation  
- Weak topic detection  
- Interview readiness prediction  

---

### 📊 Advanced Analytics
- Accuracy trends  
- Performance insights  
- Adaptive difficulty  

---

### 🏆 Competitive Features
- Weekly leaderboard  
- Rating system (Codeforces-style)  
- Global rankings  

---

## 💡 Motivation

> "Students waste time switching between platforms."

This platform combines:

**LeetCode + GFG + InterviewBit → into ONE system**

---

## 🏁 Conclusion

The platform has evolved into a **complete placement preparation ecosystem** with:

- Code execution  
- Analytics  
- Competitive ranking  
- Secure architecture  

Future work will focus on **AI-powered learning and scalability 🚀**

---

## ⭐ Contribute

Contributions are welcome!  

