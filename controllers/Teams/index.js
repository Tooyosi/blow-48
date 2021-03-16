const DbHelpers = require("../../helpers/DbHelpers")
const Models = require("../../models/index")
const Response = require("../../helpers/ResponseClass")
const { failedStatus, failureCode, successStatus, successCode } = require("../../helpers")
const logger = require("../../loggers/logger")

let dbHelper = new DbHelpers(Models, logger, failedStatus, successStatus, failureCode, successCode)


module.exports = {
    addTeam:('/', async (req, res)=>{
        let {name} = req.body
        let response
        if(name.trim() == ""){
            response = new Response(failedStatus,"Name is required", failureCode, {})
            return res.status(400).send(res)
        }

        await dbHelper.createNewInstance("team", {
            name: name
        }, res, Response)
    })
}