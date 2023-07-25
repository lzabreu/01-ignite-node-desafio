import { useState } from 'react'
import { Item } from '../types/Item'
import { Pen, Trash } from 'phosphor-react'
import { useTasks } from '../hooks/useTasks'

type Props = {
	item: Item
}

export const ListItem = ({ item }: Props) => {
	const [isChecked, setIsChecked] = useState(item.done)
	const [inputText, setInputText] = useState(item.task ? item.task : '')
	const { editTask, deleteTask, editDone } = useTasks()

	const handleDeleteTask = () => {
		deleteTask(item.id)
	}
	const handleEditTask = () => {
		if (item.task !== inputText) {
			editTask(item.id, inputText)
		}
	}
	const handleDone = () => {
		setIsChecked(!isChecked)
		editDone(item.id)
	}

	return (
		<div className='flex items-center justify-between gap-6 px-4 py-2 mt-2 rounded-md bg-slate-600'>
			<div className='flex flex-1 gap-4 text-lg text-slate-200'>
				<input
					className='border-none'
					type='checkbox'
					checked={isChecked === true ? true : false}
					onClick={handleDone}
					onChange={() => setIsChecked(!isChecked)}
				/>
				<input
					className='flex-1 px-4 py-2 rounded-md bg-slate-700'
					value={inputText}
					onChange={(e) => setInputText(e.target.value)}
				/>
			</div>
			<div className='flex gap-4 text-slate-200 items-center'>
				<div className='flex gap-2'>
					<Pen size={24} onClick={handleEditTask} />
					<Trash size={24} onClick={handleDeleteTask} />
				</div>
				<div>
					{item.createdAt && (
						<div className='flex flex-col'>
							{item.createdAt && (
								<div className='flex gap-2 text-right'>
									C:
									<span>{new Date(item.createdAt).toLocaleDateString()}</span>
									<span>{new Date(item.createdAt).toLocaleTimeString()}</span>
								</div>
							)}
							{item.updatedAt && (
								<div className='flex gap-2 text-right'>
									M: 
									<span>{new Date(item.updatedAt).toLocaleDateString()}</span>
									<span>{new Date(item.updatedAt).toLocaleTimeString()}</span>
								</div>
							)}
							{item.completedAt && (
								<div className='flex gap-2 text-right'>
									D:
									<span>{new Date(item.completedAt).toLocaleDateString()}</span>
									<span>{new Date(item.completedAt).toLocaleTimeString()}</span>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
