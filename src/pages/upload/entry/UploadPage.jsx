import { useState } from "react";
import { postCompare } from "../../../apis/compare";
import { useNavigate } from 'react-router-dom'

const initialForm = {
  dept: "",
  age_group: "",
  disease: "",
  user_fee: "",
  user_days: "",
  is_saturday: false,
  is_night: false,
  drug_items: [
    {
      drug_name: "",
      user_once_dose: "",
      user_daily_times: "",
      user_days: "",
    },
  ],
};

export default function UploadPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  // 공통 인풋 변경, 인풋 형식 바뀌면 값 저장 법도 바꿔주기
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };


  // drug_items 변경, 약 전용 저장핸들러
  const handleDrugChange = (index, e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const newDrugItems = [...prev.drug_items];
      newDrugItems[index] = {
        ...newDrugItems[index],
        [name]: value,
      };
      return { ...prev, drug_items: newDrugItems };
    });
  };

  // 약 행 추가
  const handleAddDrug = () => {
    setForm((prev) => ({
      ...prev,
      drug_items: [
        ...prev.drug_items,
        {
          drug_name: "",
          user_once_dose: "",
          user_daily_times: "",
          user_days: "",
        },
      ],
    }));
  };

  // 약 행 삭제
  const handleRemoveDrug = (index) => {
    setForm((prev) => ({
      ...prev,
      drug_items: prev.drug_items.filter((_, i) => i !== index),
    }));
  };

  // 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 숫자/boolean 형 변환
      const payload = {
        dept: form.dept,
        age_group: form.age_group,
        disease: form.disease,
        user_fee: Number(form.user_fee),
        user_days: Number(form.user_days),
        is_saturday: Boolean(form.is_saturday),
        is_night: Boolean(form.is_night),
        drug_items: form.drug_items.map((item) => ({
          drug_name: item.drug_name,
          user_once_dose: Number(item.user_once_dose),
          user_daily_times: Number(item.user_daily_times),
          user_days: Number(item.user_days),
        })),
      };
      console.log("생성된 payload:", payload);

      const result = await postCompare(payload)
      console.log('백엔드 결과:', result)
      // 현지님께 입력값 전달 
      navigate('/result', {
        state: {
          input: payload, // 사용자가 입력한 값
        },
      })


    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 16 }}>
      <h2>진단서 등록</h2>

      {/* 연령 / 병원 종류 */}
      <div>
        <label>
          연령
          <select
            name="age_group"
            value={form.age_group}
            onChange={handleChange} // 값이 변경 되면 실행
            placeholder="연령을 선택해주세요"
          >
            <option value="">선택해주세요</option>
            <option value="소아">20세 미만</option>
            <option value="성인">20세 이상 ~ 65세 미만</option>
            <option value="노인">65세 이상</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          병원 종류
          <select
            name="dept"
            value={form.dept}
            onChange={handleChange} // 값이 변경 되면 실행
            placeholder="진료과목을 선택해주세요"
          >
            <option value="">선택해주세요</option>
            <option value="0">일반의</option>
            <option value="1">내과</option>
            <option value="2">신경과</option>
            <option value="3">정신과</option>
            <option value="4">외과</option>
            <option value="5">정형외과</option>
          </select>
        </label>
      </div>

      {/* 공휴일 / 야간 여부 */}
      <div>
        <label>
          공휴일/토요일
          <input
            type="checkbox"
            name="is_saturday"
            checked={form.is_saturday}
            onChange={handleChange}
          />
        </label>
      </div>

      <div>
        <label>
          평일 야간(18:00~)
          <input
            type="checkbox"
            name="is_night"
            checked={form.is_night}
            onChange={handleChange}
          />
        </label>
      </div>

      {/* 질병 코드 */}
      <div style={{ marginBottom: 16 }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4
        }}>
          <label style={{ fontWeight: "bold" }}>질병 코드</label>

          {/* 오른쪽 링크 버튼 */}
          <a
            href="https://www.koicd.kr/mobile/kcd/list.do"   // 원하는 질병코드 사이트로 수정!
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              padding: "6px 12px",
              borderRadius: "6px",
              textDecoration: "none",
              fontSize: "13px"
            }}
          >
            질병코드 검색 사이트 이동
          </a>
        </div>

        {/* input 박스 */}
        <input
          name="disease"
          value={form.disease}
          onChange={handleChange}
          placeholder="질병 코드를 입력해주세요 (eg. A062)"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />
      </div>


      {/* 본인부담금 / 진료일수 */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontWeight: "bold", marginBottom: 4 }}>
          본인부담금
        </label>

        <input
          type="number"
          name="user_fee"
          value={form.user_fee}
          onChange={handleChange}
          placeholder="진료비를 입력해주세요 (eg. 15000)"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
      </div>


      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontWeight: "bold", marginBottom: 4 }}>
          진료 일 수
        </label>

        <input
          type="number"
          name="user_days"
          value={form.user_days}
          onChange={handleChange}
          placeholder="진료 일 수를 입력해주세요 (eg. 5)"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* 약 정보 여러 개 */}
      <h3>처방 약물</h3>
      {form.drug_items.map((drug, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: 12,
            marginBottom: 12,
            borderRadius: 8,
            background: "#f8f9ff"
          }}
        >
              {/* 가로 정렬 */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 12
              }}>
                {/* 약품명 */}
                <div style={{ flex: 2 }}>
                  <input
                    name="drug_name"
                    value={drug.drug_name}
                    onChange={(e) => handleDrugChange(index, e)}
                    placeholder="약품명"
                    style={{
                      width: "100%",
                      padding: 8,
                      borderRadius: 6,
                      border: "1px solid #ccc"
                    }}
                  />
                </div>

                {/* 1회 투약량 */}
                <div style={{ flex: 1 }}>
                  <input
                    type="number"
                    name="user_once_dose"
                    value={drug.user_once_dose}
                    onChange={(e) => handleDrugChange(index, e)}
                    placeholder="투약량"
                    style={{
                      width: "100%",
                      padding: 8,
                      borderRadius: 6,
                      border: "1px solid #ccc",
                      textAlign: "center"
                    }}
                  />
                </div>

                {/* 1일 투약 횟수 */}
                <div style={{ flex: 1 }}>
                  <input
                    type="number"
                    name="user_daily_times"
                    value={drug.user_daily_times}
                    onChange={(e) => handleDrugChange(index, e)}
                    placeholder="횟수"
                    style={{
                      width: "100%",
                      padding: 8,
                      borderRadius: 6,
                      border: "1px solid #ccc",
                      textAlign: "center"
                    }}
                  />
                </div>

                {/* 투약 일수 */}
                <div style={{ flex: 1 }}>
                  <input
                    type="number"
                    name="user_days"
                    value={drug.user_days}
                    onChange={(e) => handleDrugChange(index, e)}
                    placeholder="일수"
                    style={{
                      width: "100%",
                      padding: 8,
                      borderRadius: 6,
                      border: "1px solid #ccc",
                      textAlign: "center"
                    }}
                  />
                </div>
              </div>
   
          {form.drug_items.length > 1 && (
            <button type="button" onClick={() => handleRemoveDrug(index)}>
              이 약 삭제
            </button>
          )}
        </div>
      ))}

      <button type="button" onClick={handleAddDrug}>
        약 추가
      </button>

      {/* 제출 버튼 */}
      <div style={{ marginTop: 24 }}>
        <button type="submit" disabled={loading}>
          {loading ? "전송 중..." : "결과 보기"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>에러: {error}</p>}
    </form>
  );
}
