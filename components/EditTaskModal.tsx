import styled from '@emotion/styled'
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import useTasksStore from '@/src/store/store'
import { Task } from '@/src/types'

interface Props {
  task: Task
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

const Input = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`

const LabelInput = styled.div`
  display: flex;
  align-items: center;
`

const LabelTextInput = styled(Input)`
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

const Label = styled.span`
  background-color: ${(props) => props.color};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  margin-right: 8px;
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

const EditButton = styled(ModalButton)`
  background-color: #28a745;

  &:hover {
    background-color: #218838;
  }
`

const DeleteButton = styled(ModalButton)`
  background-color: #d70404;

  &:hover {
    background-color: #b20a25;
  }
`

const EditTaskModal = ({ task, visible, closeModal }: Props) => {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [labels, setLabels] = useState(task.labels)
  const editTask = useTasksStore((state) => state.editTask)
  const deleteTask = useTasksStore((state) => state.deleteTask)
  const deleteLabel = useTasksStore((state) => state.deleteLabel)

  const handleTaskTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleSaveClick = () => {
    if (title) {
      const newLabels = labels.filter((l) => l.text)
      setLabels(newLabels)
      editTask({ ...task, labels: newLabels })
    }
    setIsEditing(false)
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

  const handleDeleteTask = () => {
    deleteTask(task.id)
    setIsEditing(true)
  }

  const handleLabelDelete = (id: string) => {
    deleteLabel({ taskId: task.id, labelId: id })
    setLabels(labels.filter((label) => label.id !== id))
  }

  const handleCancelClick = () => {
    setTitle(task.title)
    setLabels(task.labels)
    setIsEditing(false)
  }

  const handleClose = () => {
    setIsEditing(false)
    closeModal()
  }

  return (
    <>
      {visible && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>{isEditing ? 'Edit task' : task.title || ''}</ModalHeader>
            {isEditing ? (
              <>
                <Input value={title} onChange={handleTaskTitleChange} />
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
              </>
            ) : (
              <>
                <p>{task.title}</p>
                {labels.map((label) => (
                  <div key={label.id}>
                    <Label color={label.color}>{label.text}</Label>
                    <DeleteButton onClick={() => handleLabelDelete(label.id)}>X</DeleteButton>
                  </div>
                ))}
              </>
            )}
            <ModalFooter>
              {isEditing ? (
                <>
                  <ModalButton onClick={handleCancelClick}>Cancel</ModalButton>
                  <ModalButton onClick={handleSaveClick}>Save</ModalButton>
                </>
              ) : (
                <>
                  <DeleteButton onClick={handleDeleteTask}>Delete</DeleteButton>
                  <EditButton onClick={handleEditClick}>Edit</EditButton>
                </>
              )}
              <ModalButton onClick={handleClose}>Close</ModalButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  )
}

export default EditTaskModal
