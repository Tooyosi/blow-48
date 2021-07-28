const { failedStatus, successStatus, failureCode, successCode, bin2hashData } = require("../../helpers")
const DbHelpers = require("../../helpers/DbHelpers")
const Response = require("../../helpers/ResponseClass")
const { logger } = require("../../loggers/logger")
const Models = require("../../models/index")
const multer = require('multer')
const uploadFunction = require('../../helpers/multer')
const upload = uploadFunction('./uploads/user')
var uploader = upload.single('image')
const fs = require('fs')
let { addToObject } = require('../../helpers')
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
        let { firstName, lastName, roleId, email, offset, limit } = req.query

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
            attributes: { exclude: ['password', 'reset_password_token', 'reset_password_expiry'] },
            order: [['id', 'DESC']],
        }, res, Response)
    }),

    getUserTeams: ('/', async (req, res) => {
        let { id } = req.params
        let { offset, limit } = req.query
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

    }),


    editUser: ('/', async (req, res) => {
        uploader(req, res, async (err) => {


            if (err instanceof multer.MulterError) {
                logger.error(err.message ? err.message : err.toString())
                response = new Response(failedStatus, err.message ? err.message : err.toString(), failureCode, {})
                return res.status(400)
                    .send(response)
            } else if (err) {

                logger.error(err.toString())
                response = new Response(failedStatus, err.message ? err.message : err.toString(), failureCode, {})
                return res.status(400)
                    .send(response)
            }
            else {
                let { id } = req.params
                let { firstname, lastname, gender, phone, address, bank_name, account_number } = req.body
                try {

                    let updateObj = {}
                    addToObject("firstname", firstname, updateObj)
                    addToObject("lastname", lastname, updateObj)
                    addToObject("gender", gender, updateObj)
                    addToObject("phone", phone, updateObj)
                    addToObject("address", address, updateObj)
                    addToObject("bank_name", bank_name, updateObj)
                    addToObject("account_number", account_number, updateObj)



                    let foundUser = await Models.user.findOne({
                        id: req.user.id
                    })

                    if (req.file && req.file.path) {
                        if (foundUser.img_url !== null) {
                            fs.unlinkSync(`./${foundUser.img_url}`)
                        }

                        updateObj.img_url = req.file.path
                    }


                    await dbHelper.editInstance("user", {
                        where: {
                            id: req.user.id
                        },
                        attributes: { exclude: ['password', 'reset_password_token', 'reset_password_expiry'] },
                    }, updateObj, res, Response)
                } catch (error) {
                    logger.error(error.toString())
                    response = new Response(failedStatus, error.toString(), failureCode, {})
                    return res.status(400)
                        .send(response)

                }
            }
        })

    }),

    editPassword: ('/', async (req, res) => {
        let { password, oldPassword } = req.body
        try {

            let updateObj = {}
            addToObject("password", bin2hashData(password, process.env.PASSWORD_HASH), updateObj)


            await dbHelper.editInstance("user", {
                where: {
                    id: req.user.id,
                    password: bin2hashData(oldPassword, process.env.PASSWORD_HASH)
                },
                attributes: { exclude: ['reset_password_token', 'reset_password_expiry'] },
            }, updateObj, res, Response)
        } catch (error) {
            logger.error(error.toString())
            response = new Response(failedStatus, error.toString(), failureCode, {})
            return res.status(400)
                .send(response)

        }


    }),

    getUser: ('/', async (req, res) => {
        let { id } = req.params
        await dbHelper.getSingleInstance("user", {
            where: {
                id: id
            },
            attributes: { exclude: ['password', 'reset_password_token', 'reset_password_expiry'] },
        }, res, Response)
    }),

    editRole: ('/', async (req, res) => {
        let { id } = req.params
        let { roleId } = req.body
        let response
        try {
            let foundRole = await Models.user_role.findOne({
                where: {
                id: roleId}
            })
            if (!foundRole) {
                response = new Response(failedStatus, "Role Not Found", failureCode, {})
                return res.status(404)
                    .send(response)
            }
            await dbHelper.editInstance("user", {
                where: {
                    id: id
                }
            }, {
                roleId: roleId
            }, res, Response)
        } catch (error) {
            logger.error(error.toString())
            response = new Response(failedStatus, error.toString(), failureCode, {})
            return res.status(400)
                .send(response)
        }
    })
}