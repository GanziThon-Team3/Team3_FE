import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  const goToUpload = () => {
    navigate("/upload");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 로고/텍스트 자리 - 디자인은 나중에 */}
      <h1>과잉 zero</h1>
      <p>과잉 진단은 이제 그만!</p>

      <button onClick={goToUpload} style={{ marginTop: 24 }}>
        과잉 제로 바로 가기
      </button>
    </div>
  );
}