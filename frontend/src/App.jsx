import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Questions from "./pages/Questions";
import QuestionDetail from "./pages/QuestionsDetail";
import Companies from "./pages/Companies"
import Navbar from "./components/Navbar";
import DashBoard from "./pages/DashBoard";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Companies" element={<Companies/>} />
        <Route path="/dashboard" element={<DashBoard/>} />
        <Route path="/questions/company/:company" element={<Questions />} />
        <Route path="/questions/:id" element={<QuestionDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;