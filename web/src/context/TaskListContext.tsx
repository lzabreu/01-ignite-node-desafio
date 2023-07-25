import {
	deleteTaskToDb,
	getTasksFromDb,
	insertTaskToDb,
	updateTaskToDb,
} from '../api/api'
import { Item } from '../types/Item'
import {
	ReactNode,
	createContext,
	useCallback,
	useEffect,
	useState,
} from 'react'

interface TaskContextData {
	tasks: Item[]
	getTasks: () => void
	insertTask: (newTask: Item) => void
	deleteTask: (id: string) => void
	editTask: (id: string, taskToEdit: string) => void
	editDone: (id: string) => void
}
interface TasksContextProviderProps {
	children: ReactNode
}

export const TaskListContext = createContext({} as TaskContextData)

export const TaskListContextProvider = ({
	children,
}: TasksContextProviderProps) => {
	const [tasks, setTasks] = useState<Item[]>([])

	const getTasks = useCallback(async () => {
		const taskListFromServer = await getTasksFromDb()
		setTasks(taskListFromServer)
	}, [])

	useEffect(() => {
		getTasks()
	}, [])

	const insertTask = useCallback(
		(newTask: Item) => {
			setTasks([...tasks, newTask])
			insertTaskToDb(newTask)
		},
		[tasks]
	)

	const deleteTask = useCallback(
		(id: string) => {
			const newTasks = tasks.filter((task) => task.id !== id)
			 deleteTaskToDb(id)
				setTasks(newTasks)
			
		},
		[tasks]
	)

	const editTask = useCallback(
		(id: string, taskToEdit: string) => {
			const editedTask = tasks.findIndex((task) => task.id === id)
			tasks[editedTask].task = taskToEdit
			tasks[editedTask].updatedAt = new Date().toString()
			setTasks([...tasks])
			updateTaskToDb(tasks[editedTask])
		},
		[tasks]
	)
	const editDone = useCallback(
		(id: string) => {
			const editedTask = tasks.findIndex((task) => task.id === id)
			tasks[editedTask].done = !tasks[editedTask].done
			if (tasks[editedTask].done) {
				tasks[editedTask].completedAt = new Date().toString()
			} else {
				tasks[editedTask].completedAt = ''
			}
			setTasks(tasks)
			updateTaskToDb(tasks[editedTask])
		},
		[tasks]
	)

	return (
		<TaskListContext.Provider
			value={{ tasks, getTasks, insertTask, deleteTask, editTask, editDone }}
		>
			{children}
		</TaskListContext.Provider>
	)
}
