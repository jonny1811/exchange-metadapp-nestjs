const appRoot = require('app-root-path')
require('dotenv').config({ path: `${appRoot}/config/.env` })
const connectDB = require(`${appRoot}/config/db/getMongoose`)
const sendWithdraw = require(`${appRoot}/jobs/withdraws/transaction`)
const { Worker } = require('bullmq')

const connection = {
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT
}

connectDB.then(() => {
	new Worker('withdraw-requests', async (job) => {
		return await sendWithdraw(job.data)
	},
	{ connection })
})