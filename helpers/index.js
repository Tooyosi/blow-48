const crypto = require('crypto')
const moment = require('moment-timezone')
const Response = require('./ResponseClass')

let isEmpty = (param, name) => {
    if (typeof (param) == "string" && param.trim() == "") {
        return false
    }
    else if (typeof (param) == "number" && name.includes("phone") && param.toString().length !== 11) {
        return false
    } else {
        return true
    }
}

module.exports = {

    isParamEmpty: (obj, param) => {
        return isEmpty(obj[param])
    },
    getRole: (role) => {
        let roleArr = ["Admin", "Client", "Writer"]

        return roleArr.indexOf(role) + 1
    },
    isBodyEmpty: (body) => {
        return new Promise((resolve, reject) => {
            let bodyParams = Object.keys(body)
            let resp = []
            bodyParams.forEach((field, i) => {
                resp.push(isEmpty(body[field], field))
            })

            if (resp.includes(false)) {

                reject(false)
            } else {
                resolve(true)
            }

        })
    },
    bin2hashData: (data, key) => {
        let genHash = crypto.createHmac('sha512', key).update(data, "ascii").digest('hex')
        return genHash
    },

    addMinutes: (date, minutes) => {
        return moment.tz(new Date(date.getTime() + minutes * 60000), "Africa/Lagos").format().slice(0, 19).replace('T', ' ')
    },
    failureCode: "99",
    successCode: "00",
    failedStatus: "Failed",
    successStatus: "Success",

    addToObject: (field, value, object) => {
        if (field !== "phone") {
            if (value && value.trim() !== "") {
                object[field] = value
            }
        }else {
            if (value && value.length == 11) {
                object[field] = value
            }
        }
    },
    isValueEmpty: (name, value, res)=>{
        let response
        if (!value || value.trim() == "") {
            response = new Response(this.failedStatus, `Validation error,${name} is required`, this.failureCode, {})
            return res.status(400)
                .send(response)
        }
    },

    isArrayValueEmpty: (name, value, res)=>{
        let response
        if (!value || !Array.isArray(value) || value.length < 1) {
            response = new Response(this.failedStatus, `Validation error,${name} is required and must not be empty`, this.failureCode, {})
            return res.status(400)
                .send(response)
        }
    }
}