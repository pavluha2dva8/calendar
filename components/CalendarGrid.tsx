'use client'
import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import useSWR from 'swr'
import CalendarExport from '@/components/CalendarExport'
import CalendarImageDownload from '@/components/CalendarImageDownload'
import CalendarImport from '@/components/CalendarImport'
import useTasksStore from '@/src/store/store'
import { Task } from '@/src/types'
import { daysOfWeek, fetcher, getStrDate } from '@/src/utils'
import CalendarCell from './CalendarCell'

const Grid = styled.div`
  display: grid;
  flex: 1;
  grid-template-columns: repeat(7, 1fr);
`

const DayOfWeek = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
`

const MonthYearContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`

const MonthYearText = styled.span`
  font-size: 24px;
  font-weight: bold;
`

const ArrowContainer = styled.div`
  margin: 0 16px;
  cursor: pointer;
`

const ArrowButton = styled.button`
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 50%;
  background-color: #5bbf4c;
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #4f9041;
  }
`

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`

const SearchLabel = styled.label`
  font-size: 1.2rem;
  font-weight: bold;
`

const SearchInput = styled.input`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  font-size: 1.2rem;
  width: 300px;
  transition: box-shadow 0.2s ease-in-out;

  &:focus {
    outline: none;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  }
`

const CalendarGrid = () => {
  const [search, setSearch] = useState('')
  const [currentMonthYear, setCurrentMonthYear] = useState(new Date())
  const setTasks = useTasksStore((state) => state.setTasks)
  const setHolidays = useTasksStore((state) => state.setHolidays)

  const tasks = useTasksStore((state) => state.tasks).filter((task) => {
    const isTitleMatched = task.title.toLowerCase().includes(search.toLowerCase())
    const isLabelMatched = task.labels.some((label) =>
      label.text.toLowerCase().includes(search.toLowerCase()),
    )
    return isTitleMatched || isLabelMatched
  })

  const renderCells = () => {
    const year = currentMonthYear.getFullYear()
    const month = currentMonthYear.getMonth()

    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)

    const dayOfWeekCells = daysOfWeek.map((dayOfWeek) => (
      <DayOfWeek key={dayOfWeek}>{dayOfWeek}</DayOfWeek>
    ))

    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const lastDayOfMonth = new Date(year, month + 1, 0).getDay()
    const daysInPrevMonth = new Date(year, month, 0).getDate()

    const calendarCells = daysArray.map((day) => {
      const date = new Date(year, month, day)
      const filteredTasks = tasks.filter((task) => getStrDate(task.date) === getStrDate(date))
      return (
        <CalendarCell
          key={date.toISOString()}
          date={date}
          day={day}
          tasks={filteredTasks}
          isCurrentMonth={true}
        />
      )
    })

    // Calculate cells for previous month
    const prevMonthStart = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1
    const prevMonthEnd = daysInPrevMonth - prevMonthStart + 1
    const prevMonthCells = Array.from({ length: prevMonthStart }, (_, i) => {
      const day = prevMonthEnd + i
      const date = new Date(year, month - 1, day)
      const filteredTasks = tasks.filter((task) => getStrDate(task.date) === getStrDate(date))
      return <CalendarCell key={date.toISOString()} date={date} day={day} tasks={filteredTasks} />
    })

    // Calculate cells for next month
    const nextMonthEnd = 7 - lastDayOfMonth
    const nextMonthCells = Array.from({ length: nextMonthEnd }, (_, i) => {
      const day = i + 1
      const date = new Date(year, month + 1, day)
      const filteredTasks = tasks.filter((task) => getStrDate(task.date) === getStrDate(date))
      return <CalendarCell key={date.toISOString()} date={date} day={day} tasks={filteredTasks} />
    })

    return [...dayOfWeekCells, ...prevMonthCells, ...calendarCells, ...nextMonthCells]
  }

  const previousMonth = () => {
    setCurrentMonthYear(new Date(currentMonthYear.getFullYear(), currentMonthYear.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonthYear(new Date(currentMonthYear.getFullYear(), currentMonthYear.getMonth() + 1))
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result

    if (!destination) {
      return
    }

    const draggedTask = tasks.find((task) => task.id === result.draggableId)
    if (!draggedTask) {
      return
    }
    const sourceDay = source.droppableId
    const destinationDay = destination.droppableId

    const tasksByDay = tasks.reduce((acc, task) => {
      const date = getStrDate(task.date)
      acc[date] = acc[date] || []
      acc[date].push(task)
      return acc
    }, {} as { [date: string]: Task[] })

    if (source.droppableId !== destination.droppableId) {
      const [year, month, day] = destination.droppableId.split('/')

      tasksByDay[destinationDay] = tasksByDay[destinationDay] || []
      tasksByDay[sourceDay].splice(source.index, 1)
      tasksByDay[destinationDay].splice(destination.index, 0, {
        ...draggedTask,
        date: new Date(Number(year), Number(month), Number(day)),
      })
    } else {
      tasksByDay[sourceDay] = tasksByDay[sourceDay] || []
      tasksByDay[sourceDay].splice(source.index, 1)
      tasksByDay[sourceDay].splice(destination.index, 0, draggedTask)
    }

    setTasks(Object.values(tasksByDay).flat())
  }

  const { data } = useSWR('https://date.nager.at/api/v3/NextPublicHolidaysWorldwide', fetcher)

  useEffect(() => {
    if (data) {
      const holidays = data.map(({ date, name }: { date: string; name: string }) => ({
        date,
        name,
      }))
      setHolidays(holidays)
    }
  }, [data, setHolidays])

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <MonthYearContainer>
        <ArrowContainer onClick={previousMonth}>
          <ArrowButton>{'<'}</ArrowButton>
        </ArrowContainer>
        <MonthYearText>
          {currentMonthYear.toLocaleString('default', { month: 'long' })}{' '}
          {currentMonthYear.getFullYear()}
        </MonthYearText>
        <ArrowContainer onClick={nextMonth}>
          <ArrowButton>{'>'}</ArrowButton>
        </ArrowContainer>
      </MonthYearContainer>
      <SearchContainer>
        <SearchLabel>Search:</SearchLabel>
        <SearchInput
          type="text"
          placeholder="Search tasks"
          value={search}
          onChange={handleSearchChange}
        />
        <CalendarExport />
        <CalendarImport />
        <CalendarImageDownload />
      </SearchContainer>
      <Grid id={'calendar-grid'}>{renderCells()}</Grid>
    </DragDropContext>
  )
}

export default CalendarGrid
