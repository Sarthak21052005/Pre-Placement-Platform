import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Questions from "./pages/Questions";
import QuestionDetail from "./pages/QuestionsDetail";
import Companies from "./pages/Companies"
import AdminDashboard from "./pages/AdminDashboard";
import DashBoard from "./pages/DashBoard";
import Topics from "./pages/Topics";
import TopicQuestions from "./pages/TopicQuestions";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/register" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Companies" element={<Companies/>} />
        <Route path="/dashboard" element={<DashBoard/>} />
        <Route path="/topics" element = {<Topics/>}/> 
        <Route path="/topics/:topic" element ={<TopicQuestions/>}/>
        <Route path="/questions/company/:company" element={<Questions />} />
        <Route path="/questions/:id" element={<QuestionDetail />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;