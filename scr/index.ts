import { CustomClient } from './entities'
import fs from 'fs'
import { join } from 'path'
import dotenv from 'dotenv'

dotenv.config()

const client = new CustomClient()

client.startBot()

const loads = fs.readdirSync(join(__dirname + '/startup'))

for (let file of loads) {
    const loader = require(`./startup/${file}`)?.default
    loader(client)
}