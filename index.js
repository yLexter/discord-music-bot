require('dotenv').config()

const CustomCliente = require('./scr/classes/Client');
const client = new CustomCliente()

for (file of ['commands', 'events', 'prototypes']) {
  require(`./scr/structures/${file}`)(client)
}

client.startBot()

process.on('unhandledRejection', err => {
  console.log(err);
});

process.on('uncaughtException', e => {
  console.log(e)
})


module.exports = client
