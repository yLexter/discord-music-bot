import { CustomClient } from "../entities"
import { ClientEvent } from "../shared"
import fs from 'fs'
import path from 'path'

export default async (client: CustomClient): Promise<void> => {

    const files = fs.readdirSync(path.join(__dirname, "../events")).filter(file => file.endsWith('.ts'))

    for (const filename of files) {
        const event: ClientEvent = (await import(path.join(__dirname, '../events', `${filename}`)))?.default

        if (event.once) {
            client.once(event.name, (...args) => event.run(client, ...args))
        } else {
            client.on(event.name, (...args) => event.run(client, ...args))
        }

    }

}