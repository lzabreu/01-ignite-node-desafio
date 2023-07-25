import http from 'node:http'
import path from 'node:path'
import multer from 'multer'
import fs from 'node:fs'

import { json } from './middlewares/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'
import { ImportCSV } from './utils/import-csv.js'

const server = http.createServer(async (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')

	if (req.method === 'OPTIONS') {
		res.writeHead(200)
		res.end()
		return
	}

	if (req.method === 'POST' && req.url === '/tasks/append') {
		console.log('achou a rota')

		const storage = multer.diskStorage({
			destination: function (req, file, cb) {
				cb(null, 'uploads/')
			},
			filename: function (req, file, cb) {
				cb(null, 'csv.csv')
			},
		})

		const upload = multer({ storage }).single('file')

		upload(req, res, (err) => {
			if (err) {
				res.writeHead(500, { 'Content-Type': 'text/plain' })
				res.end('Erro ao fazer o upload do arquivo.')
			} else {
				ImportCSV().then(() => {
					const path = './uploads/csv.csv'

					fs.chmod(path, '777', (chmodErr) => {
						if (chmodErr) {
							console.error(chmodErr)
							return
						}

						fs.truncate(path, 0, (truncateErr) => {
							if (truncateErr) {
								console.error(truncateErr)
								return
							} else {
								console.log('Arquivo deletado')
							}
						})
					})
				})

				res.writeHead(200, { 'Content-Type': 'text/plain' })
				res.end('Arquivo enviado e salvo com sucesso!')
			}
		})

		// const path = './uploads/csv.csv'
		// fs.chmod(path, '777', (err) => {
		// 	if (err) {
		// 		console.error(err)
		// 		return
		// 	}
		// })
		// fs.truncate(path, 0, (err) => {
		// 	if (err) {
		// 		console.error(err)
		// 		return
		// 	}else{
		// 		console.log('Arquivo deletado')
		// 	}
		// })
		return
	}

	const { method, url } = req

	await json(req, res)

	const route = routes.find((route) => {
		return route.method === method && route.path.test(url)
	})

	if (route && req.url !== '/tasks/append') {
		const routeParams = req.url.match(route.path)

		const { query, ...params } = routeParams.groups

		req.params = params
		req.query = query ? extractQueryParams(query) : {}
		console.log(`Route ${method} ${url} found`)

		return route.handler(req, res)
	}
	console.log(`Route ${method} ${url} not found`)

	return res.writeHead(404).end()
})

server.listen(3333)
