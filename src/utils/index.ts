export const getStrDate = (date: Date): string => {
  const year = new Date(date).getFullYear()
  const month = new Date(date).getMonth()
  const day = new Date(date).getDate()
  return `${year}/${month}/${day}`
}

export const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const fetcher = (url: string) => fetch(url).then((res) => res.json())
