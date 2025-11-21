import { useNavigate } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();

  const goToUpload = () => {
    navigate("/upload");
  };

  return (
    <div className="home-container">
      <img
        src="../../../src/assets/logo/logo-dark.svg"
        alt="로고"
        className="home-logo"
      />
      <div className="text-wrap">
        <div className="sub-text">
          과잉 진단은<br />이제 그만!
        </div>

        <div className="main-title">
          과잉zero
        </div>
      </div>

      <div className="btn-wrap">
        <button className="go-btn" onClick={goToUpload}>
          과잉 제로 바로 가기
        </button>
      </div>
    </div>
  );
}
