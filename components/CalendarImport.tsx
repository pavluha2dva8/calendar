import styled from '@emotion/styled'
import React from 'react'
import useTasksStore from '@/src/store/store'

const InputWrapper = styled.label`
  display: inline-block;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
`

const Input = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  opacity: 0;
`

const InputLabel = styled.span`
  display: inline-block;
  padding: 8px 16px;
  background-color: #5bbf4c;
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
  &:hover {
    background-color: #4f9041;
  }
`

const CalendarImport = () => {
  const setTasks = useTasksStore((state) => state.setTasks)

  const importCalendar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const calendarData = JSON.parse(reader.result as string)
        setTasks(calendarData.tasks)
      } catch (error) {
        console.error('Failed to import calendar', error)
      }
    }
    reader.readAsText(file)
  }

  return (
    <InputWrapper>
      <Input onChange={importCalendar} type={'file'} accept={'.json'} />
      <InputLabel>Import Calendar</InputLabel>
    </InputWrapper>
  )
}

export default CalendarImport
