import { CustomClient } from "../entities"

export default {
    name: 'ready',
    once: true,
    execute: async (client: CustomClient) => {
        console.log(`o bot ${client.user?.username} está online`)        
    }
}
