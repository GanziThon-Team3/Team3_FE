import './ResultPage.css'

import { useLocation, useNavigate } from 'react-router-dom'
import { Icon } from '../../../components/Icon/Icon'
import { DrugList } from '../component/DrugList/DrugList'
import Label from '../component/Label/Label'
import Button from '../../../components/Button/Button'
import { formatExtra, formatIntPercent, formatMoney, formatPercent } from '../hooks/useFormat'

import { useResultApi } from '../api/useResultApi'
import { useState } from 'react'
import api from '../../../apis/client'

function ResultPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [isFocus, setIsFocus] = useState(false)

  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)

  const handleClick = () => {
    navigate(`/`)
  }

  if (!state || !state.certResult) {
    return (
      <>
        <div className='result__error'>
          잘못된 접근입니다 :(
          <br />
          진단서를 다시 등록해주세요.
        </div>
        <Button content='홈 화면으로 가기' onClick={handleClick} />
      </>
    )
  }

  const handleAsk = async () => {
    if (!question.trim()) return

    try {
      setSearchLoading(true)
      const res = await api.post('/ai_answer/', { question })
      setAnswer(res.result)
    } catch (err) {
      console.error('검색 API 오류:', err)
      setAnswer('오류 발생. 새로고침 후 다시 시도해주세요.')
    } finally {
      setSearchLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAsk()
    }
  }

  // 빨간줄 무시해도 됩니댜. 뭐 규칙 때문이라 작동엔 상관ㄴㄴ
  const { info, loading, error } = useResultApi(
    state.certResult.disease,
    state.certResult.drug_name,
  )

  if (loading)
    return (
      <div className='result__loader--container'>
        <div className='result__loader'></div>
      </div>
    )
  if (error)
    return (
      <div className='result__container'>
        <div className='result__error'>
          에러 발생 :(
          <br />
          처음부터 다시해주세요!
        </div>
        <Button content='홈 화면으로 가기' onClick={handleClick} />
      </div>
    )

  const cost = state.certResult.comparison_results.treatment_fee
  const days = state.certResult.comparison_results.treatment_days
  const drugs = state.certResult.comparison_results.drug_items_comparison

  const costPercent = formatPercent(cost.difference_percent)
  const costIntPercent = formatIntPercent(cost.difference_percent)
  const extraDaysText = formatExtra(days.avg_days, days.user_days)
  console.log({ extraDaysText })

  const graphName =
    cost.level_text === '낮음'
      ? 'graph-good'
      : cost.level_text === '평균'
      ? 'graph-normal'
      : cost.level_text === '높음'
      ? 'graph-bad'
      : ''

  return (
    <>
      <div className='result__container'>
        <div className='result__graph'>
          <Icon name={graphName} width={250} className='result__graph--graph' />
          <div className='result__graph--text'>
            <h1 className='result__graph--label'>총 비용</h1>
            <h1 className='result__graph--number'>
              {costIntPercent}
              <p className='result__graph--percent'>%</p>
            </h1>
          </div>
        </div>
        <div className='result__summary'>
          <div className='result__summary--text'>
            <Label state={cost.level_text} />
            평균보다 {costPercent}%만큼 지불했어요
          </div>
          <div className='result__summary--text'>
            <Label state={days.level_text} />
            {extraDaysText}
          </div>
        </div>
        <div className='result__detail'>
          <div className='result__detail--container'>
            <h1 className='result__detail--label'>평균 지불 비용 {formatMoney(cost.avg_fee)}원</h1>
            <h1 className='result__detail--label'>평균 처방 일수 {days.avg_days}일</h1>
            <h1 className='result__detail--label'>약물 별 평균 투약량</h1>
          </div>
          {/* DrugList 컴포 매핑 */}
          {drugs.map((drug, index) => (
            <DrugList
              key={index}
              drug_name={drug.drug_name}
              avg_total_dose={drug.avg_total_dose}
              user_total_dose={drug.user_total_dose}
              level_text={drug.level_text}
            />
          ))}
        </div>
        <div className='result__notice'>
          <Icon name='common-info' width={12} height={12} />위 결과는 통계를 기준으로 계산하여
          비교했으며, 참고용으로만 사용해주세요!
        </div>
        <div className='result__info'>
          <h1 className='result__info--title'>질병 정보</h1>
          <p className='result__info--text'>{info.disease_info}</p>
          <h1 className='result__info--title'>약물 정보</h1>
          <p className='result__info--text'>{info.drug_info}</p>
          <h1 className='result__info--title'>건강 관리</h1>
          <p className='result__info--text'>{info.health_tip}</p>
        </div>
        <h1 className='result__search--title'>더 궁금한 점이 있나요?</h1>
        <div className='result__search'>
          <div className={`result__search--bar ${isFocus ? 'focus' : ''}`}>
            <Icon className='result__search--icon' name='common-search' width={16} height={16} />
            <input
              className='result__search--input'
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              placeholder='타이레놀 주의사항 알려줘'
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
            ></input>
          </div>
          <div className='result__search--text'>
            {searchLoading ? <div className='result__search--loader'></div> : answer}
          </div>
        </div>
      </div>
      <Button content='홈 화면으로 가기' onClick={handleClick} />
    </>
  )
}

export default ResultPage
