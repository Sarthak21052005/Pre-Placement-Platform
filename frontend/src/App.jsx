import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Questions from "./pages/Questions";
import QuestionDetail from "./pages/QuestionsDetail";
import Companies from "./pages/Companies"
import AdminDashboard from "./pages/AdminDashboard";
import DashBoard from "./pages/DashBoard";
import Settings  from "./pages/Settings";
import Topics from "./pages/Topics";
import MyAttempts from "./pages/myattempts"
import Profile from "./pages/Profile";
import TopicQuestions from "./pages/TopicQuestions";
function App() {
  return (
    <BrowserRouter>
    <Toaster position="top-center"/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/register" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/Companies" element={<Companies/>} />
        <Route path="/dashboard" element={<DashBoard/>} />
        <Route path="/topics" element = {<Topics/>}/> 
        <Route path="/attempts" element={<MyAttempts />} />
        <Route path="/topics/:topic" element ={<TopicQuestions/>}/>
        <Route path="/questions/company/:company" element={<Questions />} />
        <Route path="/questions/:id" element={<QuestionDetail />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;