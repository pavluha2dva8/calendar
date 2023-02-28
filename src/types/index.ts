export interface Task {
  id: string
  title: string
  date: Date
  labels: Label[]
}

export interface Label {
  id: string
  text: string
  color: string
}
