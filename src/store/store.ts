import { create } from 'zustand'
import { Holiday, Label, Task } from '@/src/types'

type State = {
  tasks: Task[]
  holidays: Holiday[]
  setHolidays: (holidays: Holiday[]) => void
  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  editTask: (task: Task) => void
  deleteTask: (taskId: string) => void
  addLabels: ({ taskId, labels }: { taskId: string; labels: Label[] }) => void
  deleteLabel: ({ taskId, labelId }: { taskId: string; labelId: string }) => void
}

const useTasksStore = create<State>((set) => ({
  tasks: [
    {
      id: '1',
      title: 'Task 1',
      date: new Date('2023-02-15T12:00:00.000Z'),
      labels: [
        {
          id: '1',
          text: 'Label 1',
          color: '#FF0000',
        },
        {
          id: '2',
          text: 'Label 2',
          color: '#00FF00',
        },
      ],
    },
    {
      id: '2',
      title: 'Task 2',
      date: new Date('2023-02-20T12:00:00.000Z'),
      labels: [
        {
          id: '3',
          text: 'Label 2',
          color: '#00FF00',
        },
        {
          id: '4',
          text: 'Label 3',
          color: '#0000FF',
        },
      ],
    },
    {
      id: '3',
      title: 'Task 3',
      date: new Date('2023-02-25T12:00:00.000Z'),
      labels: [],
    },
    {
      id: '4',
      title: 'Task 4',
      date: new Date('2023-02-25T10:00:00.000Z'),
      labels: [],
    },
    {
      id: '5',
      title: 'Task 5',
      date: new Date('2023-02-25T11:00:00.000Z'),
      labels: [],
    },
  ],
  holidays: [],
  setHolidays: (holidays) => set({ holidays }),
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  editTask: (task) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
    })),
  deleteTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
    })),
  addLabels: ({ taskId, labels }) =>
    set((state) => ({
      tasks: state.tasks.map((t) => {
        if (t.id === taskId) {
          return { ...t, labels: [...t.labels, ...labels] }
        }
        return t
      }),
    })),
  deleteLabel: ({ taskId, labelId }) =>
    set((state) => ({
      tasks: state.tasks.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            labels: t.labels.filter((l) => l.id !== labelId),
          }
        }
        return t
      }),
    })),
}))

export default useTasksStore
