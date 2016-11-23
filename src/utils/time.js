export const dateFormat = (date) => {
  const yyyy = date.getFullYear()
  const d = date.getDate()
  const m = date.getMonth() + 1
  const mm = m < 10 ? '0' + m : m
  const dd = d < 10 ? '0' + d : d
  return `${yyyy}-${mm}-${dd}`
}
export const timeFormat = (date) => {
  if (!(date instanceof Date)) {
    date = new Date(date)
  }
  const yyyy = date.getFullYear()
  const d = date.getDate()
  const H = date.getHours()
  const m = date.getMonth() + 1
  const mm = m < 10 ? '0' + m : m
  return `${yyyy}-${m}-${d} ${H}:${mm}`
}
