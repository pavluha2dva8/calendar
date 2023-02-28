'use client'
import styled from '@emotion/styled'
import React, { useState } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import AddTaskModal from '@/components/AddTaskModal'
import { Task } from '@/src/types'
import { getStrDate } from '@/src/utils'
import TaskCard from './TaskCard'

type Props = {
  date: Date
  day: number
  tasks: Task[]
  isCurrentMonth?: boolean
}

const Cell = styled.div<{ isCurrentMonth?: boolean }>`
  min-width: 150px;
  background-color: #fff;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  padding: 12px;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  opacity: ${({ isCurrentMonth }) => (isCurrentMonth ? 1 : 0.5)};
`

const AddTaskButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 50%;
  background-color: #4c51bf;
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #434190;
  }
`

const Day = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 8px;
`

const CalendarCell = ({ date, day, tasks, isCurrentMonth }: Props) => {
  const [modalVisible, setModalVisible] = useState(false)

  const handleAddTaskClick = () => {
    setModalVisible(true)
  }

  const handleCloseModal = () => {
    setModalVisible(false)
  }

  return (
    <>
      <Droppable droppableId={getStrDate(date)}>
        {(provided) => (
          <Cell
            ref={provided.innerRef}
            {...provided.droppableProps}
            isCurrentMonth={isCurrentMonth}
          >
            <Day>{day}</Day>
            <AddTaskButton onClick={handleAddTaskClick}>+</AddTaskButton>
            {tasks.map((task, index) => (
              <TaskCard key={task.id} index={index} task={task} />
            ))}
            {provided.placeholder}
          </Cell>
        )}
      </Droppable>
      <AddTaskModal date={date} visible={modalVisible} closeModal={handleCloseModal} />
    </>
  )
}

export default CalendarCell
