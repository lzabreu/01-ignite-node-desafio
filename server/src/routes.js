import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'
import fs from 'fs'



const database = new Database()


export const routes = [
	{
		method: 'GET',
		path: buildRoutePath('/tasks'),
		handler: (req, res) => {
			const { search } = req.query

			const tasks = database.select(
				'tasks',
				search
					? {
							id: search,
							task: search,
							done: search,
							completedAt: search,
							createdAt: search,
							updatedAt: search,
					  }
					: null
			)

			return res.end(JSON.stringify(tasks))
		},
	},
	{
		method: 'POST',
		path: buildRoutePath('/tasks'),
		handler: (req, res) => {
			const { id, task, done, completedAt, createdAt, updatedAt } = req.body
			const taskToInsert = {
				id,
				task,
				done,
				completedAt,
				createdAt,
				updatedAt,
			}

			database.insert('tasks', taskToInsert)

			return res.writeHead(201).end()
		},
	},
	{
		method: 'PUT',
		path: buildRoutePath('/tasks/:id'),
		handler: (req, res) => {
			const { id } = req.params
			const { task, done, completedAt, createdAt, updatedAt } = req.body

			database.update('tasks', id, {
				task,
				done,
				completedAt,
				createdAt,
				updatedAt,
			})

			return res.writeHead(204).end()
		},
	},
	{
		method: 'DELETE',
		path: buildRoutePath('/tasks/:id'),
		handler: (req, res) => {
			const { id } = req.params
			database.delete('tasks', id)
			return res.writeHead(204).end()
		},
	},
// 	{
// 		method: 'POST',
// 		path: buildRoutePath('/tasks/append'),
// 		handler: (req, res) => {
// 			console.log('achou a rota de append')
			
// 			const form = new formidable.IncomingForm()


// 			// Diretório onde os arquivos serão salvos
// 			form.uploadDir = '../uploads'

// 			form.parse(req, (err, fields, files) => {
// 				if (err) {
// 					console.error(err)
// 					res.writeHead(500, { 'Content-Type': 'text/plain' })
// 					res.end('Erro interno do servidor')
// 					return
// 				}
// console.log(files)

// 				// Obtenha o caminho temporário do arquivo
// 				const tempFilePath = files?.file?.path

// 				// Gere um nome único para o arquivo
// 				const newFileName = Date.now() + '-' + files?.file?.name

// 				// Mova o arquivo temporário para o diretório de destino
// 				fs.rename(tempFilePath, `../uploads/${newFileName}`, (err) => {
// 					if (err) {
// 						console.error(err)
// 						res.writeHead(500, { 'Content-Type': 'text/plain' })
// 						res.end('Erro ao salvar o arquivo')
// 					} else {
// 						res.writeHead(200, { 'Content-Type': 'text/plain' })
// 						res.end('Arquivo enviado com sucesso!')
// 					}
// 				})
// 			})

// 			return
// 		},
// 	},
]
