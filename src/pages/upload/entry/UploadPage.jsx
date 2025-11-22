// UploadPage.jsx

import { useState, useEffect } from 'react'
import { postCompare } from '../../../apis/compare'
import { useNavigate } from 'react-router-dom'
import Button from '../../../components/Button/Button'
import './UploadPage.css'
import { Icon } from '../../../components/Icon/Icon'
import { searchDiseases } from '../../../apis/disease'

const initialForm = {
  dept: '',
  age_group: '',
  disease: '',   // 선택된 질병 코드
  user_fee: '',
  is_saturday: false,
  is_night: false,
  drug_items: [
    {
      drug_name: '',
      user_once_dose: '',
      user_daily_times: '',
      user_days: '',
    },
  ],
}

export default function UploadPage() {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const [showPopup, setShowPopup] = useState(false)

  // 🔍 질병 검색 관련 상태
  const [diseaseQuery, setDiseaseQuery] = useState('')        // 인풋에 보이는 텍스트
  const [diseaseOptions, setDiseaseOptions] = useState([])    // 검색 결과 리스트
  const [isDiseaseLoading, setIsDiseaseLoading] = useState(false)
  const [diseaseSearchError, setDiseaseSearchError] = useState(null)

  // 공통 인풋 변경
  const handleChange = (e) => {
    let { name, value, type, checked } = e.target

    if (name === 'disease') {
      value = value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // 약 정보 변경
  const handleDrugChange = (index, e) => {
    const { name, value } = e.target
    setForm((prev) => {
      const newDrugItems = [...prev.drug_items]
      newDrugItems[index] = {
        ...newDrugItems[index],
        [name]: value,
      }
      return { ...prev, drug_items: newDrugItems }
    })
  }

  // 🔍 질병 검색 인풋 변경 (여기서는 값만 세팅)
  const handleDiseaseInputChange = (e) => {
    const value = e.target.value
    setDiseaseQuery(value)
    setDiseaseSearchError(null)
  }

  useEffect(() => {
    const q = diseaseQuery.trim()

    // 한 글자 이하면 검색 안 함 → 옵션 비우기
    if (!q || q.length < 2) {
      setDiseaseOptions([])
      return
    }

    let cancelled = false

    const timer = setTimeout(async () => {
      setIsDiseaseLoading(true)
      setDiseaseSearchError(null)

      try {
        const list = await searchDiseases(q)

        if (!cancelled) {
          setDiseaseOptions(list || [])
        }
      } catch (err) {
        console.error(err)
        if (!cancelled) {
          setDiseaseOptions([])
          setDiseaseSearchError('질병 검색 중 오류가 발생했어요.')
        }
      } finally {
        if (!cancelled) {
          setIsDiseaseLoading(false)
        }
      }
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [diseaseQuery])
  // 코드선택시
  const handleDiseaseSelect = (e) => {
    const selectedCode = e.target.value
    const selected = diseaseOptions.find((item) => item.code === selectedCode)

    if (selected) {
      setForm((prev) => ({
        ...prev,
        disease: selected.code, // 코드만 보내기
      }))
      setDiseaseQuery(`${selected.code} - ${selected.name}`)
    }
  }

  // 약 행 추가
  const handleAddDrug = () => {
    setForm((prev) => ({
      ...prev,
      drug_items: [
        ...prev.drug_items,
        {
          drug_name: '',
          user_once_dose: '',
          user_daily_times: '',
          user_days: '',
        },
      ],
    }))
  }

  // 제출
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    const payload = {
      dept: form.dept,
      age_group: form.age_group,
      disease: form.disease,   // ✅ 선택된 코드만 전송
      user_fee: Number(form.user_fee),
      is_saturday: form.is_saturday,
      is_night: form.is_night,
      drug_items: form.drug_items
        .filter((item) => item.drug_name.trim() !== '')
        .map((item) => ({
          drug_name: item.drug_name,
          user_once_dose: Number(item.user_once_dose),
          user_daily_times: Number(item.user_daily_times),
          user_days: Number(item.user_days),
        })),
    }
    console.log('생성된 payload:', payload)

    try {
      const data = await postCompare(payload)
      console.log('백엔드 응답:', data)

      const { comparison_results } = data

      navigate('/loading', {
        state: {
          comparison_results,
          disease: form.disease,
          drug_name: form.drug_items?.[0]?.drug_name,
        },
      })
    } catch (err) {
      console.error(err)
      setError('서버 요청 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="upload-page-container">
      <form onSubmit={handleSubmit} className="upload-page-form">
        {/* 중간: 스크롤 되는 부분 */}
        <div className="upload-page-scroll">
          <button
            type="button"
            className="btn-upload-image"
            onClick={() => setShowPopup(true)}
          >
            <Icon name='common-plus' width={26.72} height={28} />사진으로 등록
          </button>

          <Icon name="common-info" width={11.3} height={11.3} className="common-info" />
          <p className="info-text">사진을 추가하면 아래 내용이 자동으로 기입돼요.</p>

          {/* 연령 / 병원 종류 */}
          <div className='select-wrapper'>
            <span className='select-label'>연령</span>
            <select
              name='age_group'
              className='select-age'
              value={form.age_group}
              onChange={handleChange}
              required
            >
              <option value=''>연령을 선택해주세요</option>
              <option value='소아'>20세 미만</option>
              <option value='성인'>20세 이상 ~ 65세 미만</option>
              <option value='노인'>65세 이상</option>
            </select>
          </div>

          <div className='select-wrapper'>
            <span className='select-label'>병원 종류</span>
            <select
              name='dept'
              className='select-dept'
              value={form.dept}
              onChange={handleChange}
              required
            >
              <option value=''>진료 과목을 선택해주세요</option>
              <option value='일반의'>일반의</option>
              <option value='내과'>내과</option>
              <option value='신경과'>신경과</option>
              <option value='정신과'>정신과</option>
              <option value='외과'>외과</option>
              <option value='정형외과'>정형외과</option>
            </select>
          </div>

          {/* 공휴일 / 야간 여부 */}
          <div className='check-row'>
            <label>
              <input
                type='checkbox'
                name='is_saturday'
                className='checkbox-saturday'
                checked={form.is_saturday}
                onChange={handleChange}
              />
              공휴일/토요일
            </label>

            <label>
              <input
                type='checkbox'
                name='is_night'
                className='checkbox-night'
                checked={form.is_night}
                onChange={handleChange}
              />
              평일 야간(18:00~)
            </label>
          </div>

          <p className='info-text'>
            <Icon name='common-info' width={11.3} height={11.3} className='common-info' />
            공휴일과 야간은 진찰료/조제료 30% 추가 금액이 붙어요.
          </p>

          {/* 🔍 질병 코드 + 자동 검색 */}
          <div className='disease-section'>
            <div className='disease-header'>
              <label className='disease-label'>질병 코드</label>
            </div>

            {/* 검색 인풋 */}
            <input
              value={diseaseQuery}
              onChange={handleDiseaseInputChange}
              placeholder='질병명을 입력하면 자동으로 검색돼요 (eg. 비염)'
              className='disease-input'
            />

            {/* 로딩 표시 */}
            {isDiseaseLoading && (
              <p className='disease-helper-text'>질병을 검색하는 중이에요...</p>
            )}

            {/* 에러 메시지 */}
            {diseaseSearchError && (
              <p className='disease-error-text'>{diseaseSearchError}</p>
            )}

            {/* 검색 결과 select (있을 때만) */}
            {diseaseOptions.length > 0 && (
              <select
                className='disease-select disease-select-list'
                size={Math.min(5, diseaseOptions.length)}
                onChange={handleDiseaseSelect}
              >
                <option value='' className='disease-select-option'>질병을 선택해주세요</option>
                {diseaseOptions.map((item) => (
                  <option key={item.code} value={item.code} className='disease-select-option'>
                    {item.code} - {item.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 본인부담금 */}
          <div className='fee-section'>
            <label className='fee-label'>본인부담금</label>

            <input
              type='number'
              name='user_fee'
              value={form.user_fee}
              onChange={handleChange}
              placeholder='진료비를 입력해주세요 (eg. 15000)'
              className='fee-input'
            />
          </div>

          {/* 약 정보 여러 개 */}
          <label className='drug-text'>처방 약물</label>
          {form.drug_items.map((drug, index) => (
            <div key={index} className='drug-card'>
              <div className='drug-row'>
                <div className='drug-col-name'>
                  <input
                    name='drug_name'
                    value={drug.drug_name}
                    onChange={(e) => handleDrugChange(index, e)}
                    placeholder='약품명'
                    className='drug-input'
                  />
                </div>

                <div className='drug-col-dose'>
                  <input
                    type='number'
                    name='user_once_dose'
                    value={drug.user_once_dose}
                    onChange={(e) => handleDrugChange(index, e)}
                    placeholder='투약량'
                    className='drug-input drug-input-center'
                  />
                </div>

                <div className='drug-col-times'>
                  <input
                    type='number'
                    name='user_daily_times'
                    value={drug.user_daily_times}
                    onChange={(e) => handleDrugChange(index, e)}
                    placeholder='횟수'
                    className='drug-input drug-input-center'
                  />
                </div>

                <div className='drug-col-days'>
                  <input
                    type='number'
                    name='user_days'
                    value={drug.user_days}
                    onChange={(e) => handleDrugChange(index, e)}
                    placeholder='일수'
                    className='drug-input drug-input-center'
                  />
                </div>
              </div>
            </div>
          ))}

          <button type='button' onClick={handleAddDrug} className='btn-add-drug'>
            +
          </button>
          {error && <p className='upload-error'>에러: {error}</p>}
        </div>

        {/* 제출 버튼 */}
        <div className='submit-button-fixed'>
          <Button content='결과 보기' type='submit' />
        </div>
      </form>

      {showPopup && (
        <div className='popup-overlay'>
          <div className='popup-box'>
            <p>사진 업로드 기능은 준비 중입니다.</p>
            <button className='popup-close' onClick={() => setShowPopup(false)}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
