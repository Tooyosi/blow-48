const { failedStatus, successStatus, failureCode, successCode } = require("../../helpers")
const DbHelpers = require("../../helpers/DbHelpers")
const Response = require("../../helpers/ResponseClass")
const { logger } = require("../../loggers/logger")
const Models = require("../../models/index")


let dbHelper = new DbHelpers(Models, logger, failedStatus, successStatus, failureCode, successCode)
module.exports = {
    getRoles: ('/', async (req, res) => {
        await dbHelper.getAllInstance("user_role", {}, res, Response)
    }),

    addRole: ('/', async (req, res) => {
        await dbHelper.createNewInstance("user_role", {
            role: req.body.role
        }, res, Response)

    })
}