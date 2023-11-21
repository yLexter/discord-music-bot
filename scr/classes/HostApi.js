
const fecth = require('node-fetch')

class SquareAPI {

    constructor() {
        this.appId = "5a5edda0686b48aeb8e375633f07064d"
        this.urlStatus = "https://api.squarecloud.app/v1/public/status/"
        this.urlLogs = "https://api.squarecloud.app/v1/public/logs/"
        this.urlRestart = "https://api.squarecloud.app/v1/public/restart/"
        this.urlStop = "https://api.squarecloud.app/v1/public/stop/"
        this.urlStart = "https://api.squarecloud.app/v1/public/start/"
        this.totalRam = 256
    }

    async fetchApi(url, method) {
        return await fecth(url + this.appId, {
            method: method,
            headers: { Authorization: process.env.SQUARE_API_TOKEN }
        })
            .then(response => response.json())
    }

    async getStatus() {
        return this.fetchApi(this.urlStatus, "GET")
    }

    async getLogs() {
        const response = await this.fetchApi(this.urlLogs, "GET")

        return response.status == 'error' ? "Não foi possível carregar as logs." : response.response.logs
    }

    async restartApp() {
        return this.fetchApi(this.urlRestart, "POST")
    }

    async stopApp() {
        return this.fetchApi(this.urlStop, "POST")
    }

    async startApp() {
        return this.fetchApi(this.urlStart, "POST")
    }

}

module.exports = new SquareAPI()