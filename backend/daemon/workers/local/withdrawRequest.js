const appRoot = require('app-root-path')
require('dotenv').config({
	path: `${appRoot}/config/.env`
})
const {
	Worker
} = require('bullmq')

new Worker('withdraw-requests', async (job) => {
	console.log('Working...')
	console.log(job.data)
}, {
	connection: {
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT
	}
})