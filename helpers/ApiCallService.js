const axios = require("axios")
const { logger } = require('../loggers/logger')

class ApiCallService {
    constructor(token) {
        this.headers = {
            Authorization: `Bearer ${token}`
        }
    }

    async makeCall(method, url, data) {
        return axios({
            method: method,
            url: url,
            headers: this.headers,
            data: data ? data : null
        })



    }
}

module.exports = AlepoCallService