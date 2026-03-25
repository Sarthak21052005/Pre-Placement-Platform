import Navbar from "../components/Navbar";
import CompanyCard from "../components/CompanyCard";  
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/companies.css";

function Companies() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const companies = [
    { name: "Amazon", logo: "/logos/amazon.png" },
    { name: "Google", logo: "/logos/google.png" },
    { name: "Microsoft", logo: "/logos/microsoft.png" },
    { name: "Infosys", logo: "/logos/infosys.jpg" },
    { name: "Netflix", logo: "/logos/netflix.png" },
    { name: "Meta", logo: "/logos/meta.png" },
    { name: "Apple", logo: "/logos/apple.png" }
  ];

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* ✅ PASS PROPS TO NAVBAR */}
      <Navbar search={search} setSearch={setSearch} />

      <div className="dashboard">
        <div className="main-content">
          <h1>Top Companies</h1>

          <div className="company-grid">
            {/* ✅ USE FILTERED DATA */}
            {filteredCompanies.map((c) => (
              <CompanyCard
                key={c.name}
                company={c.name}
                logo={c.logo}
                onClick={() => navigate(`/questions/company/${c.name}`)}
              />
            ))}
          </div>

          {/* ✅ OPTIONAL: No results */}
          {filteredCompanies.length === 0 && (
            <p>No companies found</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Companies;