import { useNavigate } from "react-router-dom";
import '../styles/BackToHomeButton.css';

const BackToHomeButton = ({ className = "back-btn", label = "Return to Home" }) => {
  const navigate = useNavigate();

  return (
    <button className={className} onClick={() => navigate("/")}>
      {label}
    </button>
  );
};

export default BackToHomeButton;
