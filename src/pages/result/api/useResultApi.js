import { useState, useEffect } from 'react'
import api from '../../../apis/client'

export function useResultApi(disease, drugName) {
  const [info, setInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadResult() {
      try {
        const body = {
          disease,
          drug_name: drugName,
        }

        const data = await api.post('/ai_info/', body)
        setInfo(data)
      } catch (err) {
        console.error('결과 API 오류:', err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    loadResult()
  }, [disease, drugName])

  return { info, loading, error }
}
