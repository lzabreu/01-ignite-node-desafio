import { Item } from '../types/Item'

export async function getTasksFromDb() {
	const response = await fetch('http://localhost:3333/tasks').then((res) =>
		res.json()
	)
	if (!response) {
		throw new Error('Error')
	}

	return response
}

export async function insertTaskToDb(newTask: Item) {
	const json = JSON.stringify(newTask)
	await fetch('http://localhost:3333/tasks', {
		method: 'POST',
		body: json,
	})
}

export async function deleteTaskToDb(id: string) {
	await fetch(`http://localhost:3333/tasks/${id}`, {
		method: 'DELETE',
	})
}
export async function updateTaskToDb(newTask: Item) {
	const json = JSON.stringify(newTask)

	await fetch(`http://localhost:3333/tasks/${newTask.id}`, {
		method: 'PUT',
		body: json,
	})
}

export async function uploadCSVFile(file: FormData) {
	if (!file) {
		alert('Form data is empty. Please select a file.')
		return
	}

	try {
		const response = await fetch('http://localhost:3333/tasks/append', {
			method: 'POST',
			body: file,
		})

		if (response.ok) {
			console.error('CSV file uploaded successfully!')
		} else {
			console.error('Error uploading the CSV file.')
		}
	} catch (error) {
		console.error('Error uploading the CSV file:', error)

	}
}
