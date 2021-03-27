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

    }),

    
    getAllUsers: ('/', async (req, res) => {
        let { firstName, lastName, roleId, email, offset, limit} = req.query

        let whereObj = {}
        if (firstName && firstName !== "") {
            whereObj.firstName = firstName
        }
        if (lastName && lastName !== "") {
            whereObj.lastName = lastName
        }
        if (roleId && roleId !== "") {
            whereObj.roleId = roleId
        }
        if (email && email !== "") {
            whereObj.email = email
        }

        await dbHelper.getPaginatedInstance("user", {
            where: whereObj,
            offset: offset ? Number(offset) : offset,
            limit: limit ? Number(limit) : 10,
            attributes: {exclude: ['password', 'reset_password_token', 'reset_password_expiry']},
            order: [['id', 'DESC']],
        }, res, Response)
    }),

    getUserTeams:('/', async (req, res)=>{
        let {id} = req.params
        let {offset, limit} = req.query
        await dbHelper.getPaginatedInstance("team_members", {
            where: {
                userId: id
            },
            offset: offset ? Number(offset) : offset,
            limit: limit ? Number(limit) : 10,
            include: {
                model: Models.team,
                as: 'team',
            },
            order: [['id', 'DESC']],
        }, res, Response)
        
    })

}