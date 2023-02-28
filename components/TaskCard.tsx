import styled from '@emotion/styled'
import React, { useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import EditTaskModal from '@/components/EditTaskModal'
import { Task } from '@/src/types'

type Props = {
  task: Task
  index: number
}

const Card = styled.div`
  background-color: #f5f5f5;
  border-radius: 3px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  padding: 10px;
  margin-bottom: 5px;
`

const Label = styled.div<{ color: string }>`
  background-color: ${({ color }) => color};
  border-radius: 3px;
  color: #fff;
  display: inline-block;
  font-size: 0.8rem;
  margin-right: 5px;
  padding: 2px 5px;
`

const TaskCard = ({ task, index }: Props) => {
  const [modalVisible, setModalVisible] = useState(false)

  const handleTaskClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    setModalVisible(true)
  }

  const handleCloseModal = () => {
    setModalVisible(false)
  }
  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={handleTaskClick}
            className={'task-card'}
          >
            <div>{task.title}</div>
            {task.labels.map((label) => (
              <Label key={label.id} color={label.color}>
                {label.text}
              </Label>
            ))}
          </Card>
        )}
      </Draggable>
      <EditTaskModal task={task} visible={modalVisible} closeModal={handleCloseModal} />
    </>
  )
}

export default TaskCard
