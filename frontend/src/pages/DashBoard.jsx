import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar"
import CompanyCard from "../components/CompanyCard";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css"; 
function Dashboard() {
  const navigate = useNavigate();
 const companies = [
  { name: "Amazon", logo: "/logos/amazon.png" },
  { name: "Google", logo: "/logos/google.png" },
  { name: "Microsoft", logo: "/logos/microsoft.png" },
  { name: "Infosys", logo: "/logos/infosys.jpg" },
  { name: "Netflix", logo: "/logos/netflix.png" },
  { name: "Meta", logo: "/logos/meta.png"},
  {name : "Apple" , logo : "/logos/apple.png"}
];

  return (
    <>
      <Navbar />

      <div className="dashboard">
        <Sidebar />

        <div className="main-content">
          <h1>Top Companies</h1>
          <div className="company-grid">
            {companies.map(c => (
              <CompanyCard
                key={c.name}
                company={c.name}
                logo={c.logo}
                onClick={() => navigate(`/questions/company/${c.name}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;