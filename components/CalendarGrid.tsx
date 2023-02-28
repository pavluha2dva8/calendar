'use client'
import styled from '@emotion/styled'
import React, { useState } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import useTasksStore from '@/src/store/store'
import { Task } from '@/src/types'
import { getStrDate } from '@/src/utils'
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

const CalendarGrid = () => {
  const tasks = useTasksStore((state) => state.tasks)
  const setTasks = useTasksStore((state) => state.setTasks)
  const [currentMonthYear, setCurrentMonthYear] = useState(new Date())

  const renderCells = () => {
    const year = currentMonthYear.getFullYear()
    const month = currentMonthYear.getMonth()

    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)

    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <MonthYearContainer>
        <ArrowContainer onClick={previousMonth}>
          <ArrowButton>{'<'}</ArrowButton>
        </ArrowContainer>
        <MonthYearText>
          {currentMonthYear.toLocaleString('default', { month: 'long' })}
          {currentMonthYear.getFullYear()}
        </MonthYearText>
        <ArrowContainer onClick={nextMonth}>
          <ArrowButton>{'>'}</ArrowButton>
        </ArrowContainer>
      </MonthYearContainer>
      <Grid>{renderCells()}</Grid>
    </DragDropContext>
  )
}

export default CalendarGrid
