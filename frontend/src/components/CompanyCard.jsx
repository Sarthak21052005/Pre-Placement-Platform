import "../styles/companyCard.css";

function CompanyCard({ company, logo, onClick }) {
  return (
    <div className="company-card" onClick={onClick}>
      <img src={logo} alt={company} />
      <h3>{company}</h3>
    </div>
  );
}

export default CompanyCard;