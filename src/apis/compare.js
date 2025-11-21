export async function postCompare(payload) {
  // 백엔드가 준 url로 교체
  const response = await fetch("http://127.0.0.1:8000/compare/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    // 에러 처리는 상황에 맞게
    const text = await response.text();
    throw new Error(`API Error: ${response.status} / ${text}`);
  }

  return response.json(); // 결과 JSON
}