export function formatPercent(value) {
  if (value == null) return null
  if (value > 0) return `+${value}`
  return `${value}`
}

export function formatIntPercent(value) {
  if (typeof value !== 'number') return value

  const rounded = Math.round(value) // 정수 자리 반올림
  const sign = rounded > 0 ? '+' : ''

  return sign + rounded
}

export function formatExtra(avg, user) {
  const fixedAvg = parseFloat(avg.toFixed(2))
  const fixedUser = parseFloat(user.toFixed(2))

  const extra = fixedUser - fixedAvg
  const extraAbs = Math.abs(extra)

  const clean = parseFloat(extraAbs.toFixed(2))

  if (extra > 0) return `평균보다 처방 일수가 ${clean}일 추가됐어요`
  if (extra < 0) return `평균보다 ${clean}일 덜 처방했어요`
  return `평균과 동일한 일수만 처방받았어요`
}

export function formatMoney(value) {
  if (value == null) return ''
  return value.toLocaleString('ko-KR')
}
