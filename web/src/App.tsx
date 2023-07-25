import { ChangeEvent, useRef, useState } from 'react'
import { GetTask } from './components/GetTask'
import { ListItem } from './components/ListItem'
import { useTasks } from './hooks/useTasks'
import { uploadCSVFile } from './api/api'

function App() {
	const { tasks, getTasks } = useTasks()
	const [csvFile, setCsvFile] = useState<File | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleChooseFile = () => {
		fileInputRef.current?.click()
	}
	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] || null

		setCsvFile(file)
	}
	const handleUpload = async () => {
		if (csvFile) {
			const formData = new FormData()
			formData.append('file', csvFile)
			await uploadCSVFile(formData).then(() => {
				getTasks()
			})
		}
	}

	return (
		<div className='flex flex-col w-screen h-screen px-48 py-10 bg-slate-900'>
			<div className='flex items-center justify-end text-2xl text-slate-200 gap-20'>
				Lista de Tarefas
				<div className='flex gap-6'>
					<input
						type='file'
						ref={fileInputRef}
						style={{ display: 'none' }}
						onChange={handleFileChange}
					/>
					<button
						className='px-4 py-2 rounded-md bg-slate-700'
						onClick={handleChooseFile}
					>
						Escolha o arquivo
					</button>
					<button
						className='px-4 py-2 rounded-md bg-slate-700'
						onClick={handleUpload}
					>
						Upload
					</button>
				</div>
			</div>
			<div className='flex flex-col items-center justify-center pl-1 mb-6 text-2xl text-slate-200'>
				<GetTask />
			</div>
			<div className='flex flex-col items-center h-screen overflow-y-scroll '>
				{tasks && tasks.map((item) => <ListItem key={item.id} item={item} />)}
			</div>
		</div>
	)
}

export default App
