import './ResultPage.css'

import { useLocation, useNavigate } from 'react-router-dom'
import { Icon } from '../../../components/Icon/Icon'
import { DrugList } from '../component/DrugList/DrugList'
import Label from '../component/Label/Label'
import Button from '../../../components/Button/Button'
import { formatExtra, formatIntPercent, formatMoney, formatPercent } from '../hooks/useFormat'

import { useResultApi } from '../api/useResultApi'

function ResultPage() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const handleClick = () => {
    navigate(`/`)
  }

  console.log(state)

  console.log(state.certResult.info.drug_name)

  const { info, loading, error } = useResultApi(
    state.certResult.info.disease,
    state.certResult.info.drug_name,
  )

  if (loading)
    return (
      <div className='result__loader--container'>
        <div className='result__loader'></div>
      </div>
    )
  if (error) return <div>에러 발생</div>

  if (!state || !state.certResult) {
    return (
      <>
        <div className='result__container'>잘못된 접근입니다.</div>
        <Button content='홈 화면으로 가기' onClick={handleClick} />
      </>
    )
  }

  const cost = state.certResult.treatment_fee
  const days = state.certResult.treatment_days
  const drugs = state.certResult.drug_items_comparison

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
      </div>
      <Button content='홈 화면으로 가기' onClick={handleClick} />
    </>
  )
}

export default ResultPage
