import styled from '@emotion/styled'
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import useTasksStore from '@/src/store/store'
import { Label } from '@/src/types'

interface Props {
  date: Date
  visible: boolean
  closeModal: () => void
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`

const ModalContent = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 25px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  width: 500px;
`

const ModalHeader = styled.div`
  font-weight: bold;
  font-size: 1.4rem;
`

const TitleInput = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`

const LabelInput = styled.div`
  display: flex;
  align-items: center;
`

const LabelTextInput = styled(TitleInput)`
  flex-grow: 1;
  margin-right: 10px;
`

const LabelColorSelect = styled.select`
  width: 100px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  cursor: pointer;
`

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`

const ModalButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border-radius: 5px;
  border: none;
  margin-left: 10px;
  cursor: pointer;

  &:hover {
    background-color: #0062cc;
  }
`

const AddTaskModal = ({ date, visible, closeModal }: Props) => {
  const [title, setTitle] = useState('')
  const [labels, setLabels] = useState<Label[]>([])
  const addTask = useTasksStore((state) => state.addTask)
  const addLabels = useTasksStore((state) => state.addLabels)

  const handleTaskTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  const handleLabelTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(event.target.name)
    const value = event.target.value
    const updatedLabels = [...labels]
    updatedLabels[index].text = value
    setLabels(updatedLabels)
  }

  const handleLabelColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(event.target.name)
    const value = event.target.value
    const updatedLabels = [...labels]
    updatedLabels[index].color = value
    setLabels(updatedLabels)
  }

  const handleAddLabelClick = () => {
    setLabels([...labels, { id: uuidv4(), text: '', color: '#007bff' }])
  }

  const handleRemoveLabelClick = (index: number) => {
    const updatedLabels = [...labels]
    updatedLabels.splice(index, 1)
    setLabels(updatedLabels)
  }

  const handleAddTaskClick = () => {
    if (title) {
      const task = {
        id: uuidv4(),
        title,
        date,
        labels: [],
      }
      addTask(task)
      setTitle('')
      if (labels.length) {
        addLabels({
          taskId: task.id,
          labels,
        })
        setLabels([])
      }
    }

    closeModal()
  }

  const handleClose = () => {
    setTitle('')
    setLabels([])
    closeModal()
  }

  return visible ? (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>Create Task</ModalHeader>
        <TitleInput
          type="text"
          placeholder="Title"
          value={title}
          onChange={handleTaskTitleChange}
        />
        {labels.map((label, index) => (
          <LabelInput key={label.id}>
            <LabelTextInput
              type="text"
              placeholder="Label text"
              value={label.text}
              name={index.toString()}
              onChange={handleLabelTextChange}
            />
            <LabelColorSelect
              name={index.toString()}
              defaultValue={'#007bff'}
              value={label.color}
              onChange={handleLabelColorChange}
            >
              <option value="#007bff">Blue</option>
              <option value="#28a745">Green</option>
              <option value="#ffc107">Yellow</option>
              <option value="#dc3545">Red</option>
            </LabelColorSelect>
            <ModalButton onClick={() => handleRemoveLabelClick(index)}>Remove</ModalButton>
          </LabelInput>
        ))}
        <ModalButton onClick={handleAddLabelClick}>Add Label</ModalButton>
        <ModalFooter>
          <ModalButton onClick={handleAddTaskClick}>Create</ModalButton>
          <ModalButton onClick={handleClose}>Cancel</ModalButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  ) : null
}

export default AddTaskModal
