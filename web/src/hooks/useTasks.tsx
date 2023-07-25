import { useContext } from 'react'
import { TaskListContext } from '../context/TaskListContext'

export function useTasks() {
	return useContext(TaskListContext)
}
