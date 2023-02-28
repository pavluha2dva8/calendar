import styled from '@emotion/styled'
import { saveAs } from 'file-saver'
import useTasksStore from '@/src/store/store'

const Button = styled.button`
  padding: 8px 16px;
  background-color: #5bbf4c;
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #4f9041;
  }
`

const CalendarExport = () => {
  const tasks = useTasksStore((state) => state.tasks)

  const exportCalendar = () => {
    const calendarData = {
      tasks,
    }
    const blob = new Blob([JSON.stringify(calendarData)], {
      type: 'application/json;charset=utf-8',
    })
    saveAs(blob, 'calendar.json')
  }

  return <Button onClick={exportCalendar}>Export</Button>
}

export default CalendarExport
