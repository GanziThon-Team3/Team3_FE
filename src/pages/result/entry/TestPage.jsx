import { useNavigate } from 'react-router-dom'
import Button from '../../../components/Button/Button'

function TestPage() {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate(`/loading`, {
      state: {
        disease: 'A062',
        drug_name: '세파피린정',
        comparison_results: {
          treatment_fee: {
            sample_count: 16,
            avg_fee: 22629,
            user_fee: 15000,
            difference_percent: -33.71,
            level_text: '평균',
          },
          treatment_days: {
            sample_count: 16,
            avg_days: 4.1,
            user_days: 3,
            difference_percent: 29.03,
            level_text: '평균',
          },
          drug_items_comparison: [
            {
              drug_name: '세파피린정',
              sample_count: 3357,
              avg_total_dose: 12.75,
              user_total_dose: 27.0,
              difference_percent: 111.72,
              level_text: '높음',
            },
            {
              drug_name: '세토펜현탁액',
              sample_count: 3357,
              avg_total_dose: 12.75,
              user_total_dose: 27.0,
              difference_percent: 111.72,
              level_text: '평균',
            },
            {
              drug_name: '세토펜현탁액',
              sample_count: 3357,
              avg_total_dose: 2.73,
              user_total_dose: 4.0,
              difference_percent: 111.72,
              level_text: '낮음',
            },
          ],
        },
      },
    })
  }
  return (
    <>
      <Button content='데이터 전송' onClick={handleClick} />
    </>
  )
}
export default TestPage
