import { v4 as uuid } from 'uuid'
import { useState, KeyboardEvent } from 'react'
import { Item } from '../types/Item'
import { useTasks } from '../hooks/useTasks'

export const GetTask = () => {
	const { insertTask } = useTasks()
	const [inputText, setInputText] = useState('')




	const handleKeyUp = (e: KeyboardEvent) => {
		if (e.code === 'Enter' && inputText !== '') {
			const newTask: Item = {
				id: uuid(),
				task: inputText,
				done: false,
				createdAt: new Date().toString(),
				completedAt: '',
				updatedAt: '',
			}
			insertTask(newTask)
			setInputText('')
		}
	}

	

	return (
		<div>
			<input
				className='px-4 py-2 mt-8 rounded-md bg-slate-700'
				type='text'
				placeholder='Adicione uma tarefa'
				value={inputText}
				onChange={(e) => setInputText(e.target.value)}
				onKeyUp={handleKeyUp}
			/>
		</div>
	)
}
