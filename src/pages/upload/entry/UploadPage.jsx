import { useState } from 'react'
import { postCompare } from '../../../apis/compare'
import { useNavigate } from 'react-router-dom'
import Button from '../../../components/Button/Button'
import './UploadPage.css'
import { Icon } from '../../../components/Icon/Icon'

const initialForm = {
  dept: '',
  age_group: '',
  disease: '',
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
  const [showPopup, setShowPopup] = useState(false) // 사진으로 추가 팝업

  // 공통 인풋 변경, 인풋 형식 바뀌면 값 저장 법도 바꿔주기
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

  // drug_items 변경, 약 전용 저장핸들러
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
    }));
  };


  // 제출
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // 숫자/boolean 형 변환
    const payload = {
      dept: form.dept,
      age_group: form.age_group,
      disease: form.disease,
      user_fee: Number(form.user_fee),
      is_saturday: form.is_saturday,
      is_night: form.is_night,
      drug_items: form.drug_items
        .filter((item) => item.drug_name.trim() !== '') // 비어있으면 제외
        .map((item) => ({
          drug_name: item.drug_name,
          user_once_dose: Number(item.user_once_dose),
          user_daily_times: Number(item.user_daily_times),
          user_days: Number(item.user_days),
        })),
    }
    console.log('생성된 payload:', payload)

    try {
      // 2) 백엔드에 보내고 응답 받기
      const data = await postCompare(payload)
      console.log('백엔드 응답:', data)

      // data = { comparison_results: { ... } } 형태
      const { comparison_results } = data

      // 3) 현지님(ResultPage)에 comparison_results 넘기기
      navigate('/loading', {
        state: {
          comparison_results,             // 기존 값
          disease: form.disease,          // 추가 1
          drug_name: form.drug_items?.[0]?.drug_name,    // 추가 2
        },
      });

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

          {/* 질병 코드 */}
          <div className='disease-section'>
            <div className='disease-header'>
              <label className='disease-label'>질병 코드</label>

              {/* 오른쪽 링크 버튼 */}
              <a
                href='https://www.koicd.kr/mobile/kcd/list.do' // 원하는 질병코드 사이트로 수정!
                target='_blank'
                rel='noopener noreferrer'
                className='disease-link-button'
              >
                질병코드 검색 사이트 이동
              </a>
            </div>

            {/* input 박스 */}
            <input
              name='disease'
              value={form.disease}
              onChange={handleChange}
              placeholder='질병 코드를 입력해주세요 (eg. A062)'
              className='disease-input'
            />
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
              {/* 가로 정렬 */}
              <div className='drug-row'>
                {/* 약품명 */}
                <div className='drug-col-name'>
                  <input
                    name='drug_name'
                    value={drug.drug_name}
                    onChange={(e) => handleDrugChange(index, e)}
                    placeholder='약품명'
                    className='drug-input'
                  />
                </div>

                {/* 1회 투약량 */}
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

                {/* 1일 투약 횟수 */}
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

                {/* 투약 일수 */}
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