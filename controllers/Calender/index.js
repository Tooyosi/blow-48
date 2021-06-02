const DbHelpers = require("../../helpers/DbHelpers")
const Models = require("../../models/index")
const Response = require("../../helpers/ResponseClass")
const { failedStatus, failureCode, successStatus, successCode, isValueEmpty, isArrayValueEmpty, addToObject } = require("../../helpers")
const { logger } = require("../../loggers/logger")


let dbHelper = new DbHelpers(Models, logger, failedStatus, successStatus, failureCode, successCode)


module.exports = {
    addCalender: ('/', async (req, res) => {
        let { name, startTime, endTime, description, membersArr } = req.body
        let response
        isValueEmpty("name", name, res)
        isValueEmpty("startTime", startTime, res)
        isValueEmpty("endTime", endTime, res)
        isValueEmpty("description", description, res)
        isArrayValueEmpty("membersArr", membersArr, res)

        let newCalender
        try {
            newCalender = await Models.calender.create({
                userId: req.user.id,
                name: name,
                startDate: startTime,
                endDate: endTime,
                description: description
            })

        } catch (error) {
            logger.error(error.toString())
            response = new Response(failedStatus, "An Error Occured", failureCode, error)
            return res.status(400)
                .send(response)
        }

        let newMembersArr = []
        for (let i = 0; i < membersArr.length; i++) {
            let newObj = {
                calenderId: newCalender.id,
                userId: membersArr[i]
            }

            newMembersArr.push(newObj)
        }

        try {
            let newCalenderMembers = await Models.calender_members.bulkCreate(newMembersArr)
        } catch (error) {

        }
        response = new Response(successStatus, successStatus, successCode, newCalender)
        return res.status(200).send(response)

    }),

    getCalenders: ('/', async (req, res) => {
        let { name, startTime, endTime, description, offset, limit } = req.query

        let whereObj = {}
        addToObject("name", name, whereObj)
        addToObject("startTime", startTime, whereObj)
        addToObject("endTime", endTime, whereObj)
        addToObject("description", description, whereObj)

        await dbHelper.getPaginatedInstance("calender", {
            where: whereObj,
            offset: offset ? Number(offset) : 0,
            limit: limit ? Number(limit) : 10,
            order: [['id', 'DESC']],
        }, res, Response)
    }),

    getCalenderMembers: ('/', async (req, res) => {
        let { id } = req.params
        let response
        try {
            let foundCalender = await Models.calender.findOne({
                where: {
                    id: id
                }
            })
            if (foundCalender == null || foundCalender == undefined) {
                response = new Response(failedStatus, "Calender not found", failureCode, {})
                return res.status(404)
                    .send(response)
            }


            await dbHelper.getAllInstance("calender_members", {
                where: {
                    calenderId: foundCalender.id
                },
                include: {
                    model: Models.user,
                    as: 'user',
                    attributes: ['firstname', 'lastname', 'email', "img_url"],
                    include: {
                        model: Models.user_role,
                        as: 'user_role',
                        attributes: ['role']

                    }
                },
            }, res, Response)
        } catch (error) {
            logger.error(error.toString())
            response = new Response(failedStatus, error.toString(), failureCode, {})
            return res.status(400)
                .send(response)
        }
    }),

    addCalenderMember: ('/', async (req, res) => {
        let { userId } = req.body
        let { id } = req.params
        let response
        try {

            let foundCalender = await Models.calender.findOne({
                where: {
                    id: id
                }
            })

            if (foundCalender == null || foundCalender == undefined) {

                response = new Response(failedStatus, "Calender not found", failureCode, {})
                return res.status(404)
                    .send(response)

            }

            let foundUser = await Models.user.findOne({
                where: {
                    id: userId
                }
            })
            if (foundUser == null || foundUser == undefined) {

                response = new Response(failedStatus, "User not found", failureCode, {})
                return res.status(404)
                    .send(response)

            }

            let userInTeam = await Models.calender_members.findOne({
                where: {
                    calenderId: foundCalender.id,
                    userId: userId
                }
            })

            if (userInTeam !== null && userInTeam !== undefined) {

                response = new Response(failedStatus, "User is already on this team", failureCode, {})
                return res.status(400)
                    .send(response)
            }
            await dbHelper.createNewInstance("calender_members", {
                calenderId: foundCalender.id,
                userId: userId
            }, res, Response)

        } catch (error) {
            logger.error(error.toString())
            response = new Response(failedStatus, error.toString(), failureCode, {})
            return res.status(400)
                .send(response)

        }
    }),

    editMember: ('/', async (req, res) => {
        let { newUserId } = req.body
        let { id, userId } = req.params
        let response

        if (!newUserId || newUserId.trim() == "") {

            response = new Response(failedStatus, "New UserId is required", failureCode, {})
            return res.status(404)
                .send(response)
        }
        try {

            let foundCalender = await Models.calender.findOne({
                where: {
                    id: id
                }
            })

            if (foundCalender == null || foundCalender == undefined) {

                response = new Response(failedStatus, "Project not found", failureCode, {})
                return res.status(404)
                    .send(response)

            }

            let foundUser = await Models.user.findOne({
                where: {
                    id: newUserId
                }
            })
            if (foundUser == null || foundUser == undefined) {

                response = new Response(failedStatus, "User not found", failureCode, {})
                return res.status(404)
                    .send(response)

            }

            let userInTeam = await Models.calender_members.findOne({
                where: {
                    calenderId: foundCalender.id,
                    userId: newUserId
                }
            })

            if (userInTeam !== null && userInTeam !== undefined) {

                response = new Response(failedStatus, "User is already on this team", failureCode, {})
                return res.status(400)
                    .send(response)
            }
            await dbHelper.editInstance("calender_members", {
                where: {
                    calenderId: foundCalender.id,
                    userId: userId
                }
            }, {
                userId: newUserId
            }, res, Response)

        } catch (error) {
            logger.error(error.toString())
            response = new Response(failedStatus, error.toString(), failureCode, {})
            return res.status(400)
                .send(response)

        }
    }),

    
    deleteMember: ('/', async (req, res) => {
        let { id, userId } = req.params
        try {

            let foundCalender = await Models.calender.findOne({
                where: {
                    id: id
                }
            })

            if (foundCalender == null || foundCalender == undefined) {

                response = new Response(failedStatus, "Calender not found", failureCode, {})
                return res.status(404)
                    .send(response)

            }

            await dbHelper.deleteInstance("calender_members", {
                where: {
                    calenderId: foundCalender.id,
                    userId: userId
                }
            }, res, Response)
        } catch (error) {
            logger.error(error.toString())
            response = new Response(failedStatus, error.toString(), failureCode, {})
            return res.status(400)
                .send(response)

        }
    }),

    deleteCalender: ('/', async(req, res)=>{
        let {id} = req.params

        await Models.calender_members.destroy({
            where:  {
                calenderId: id
            }
        })
        await dbHelper.deleteInstance("calender", {
            where: {
                id: id
            }
        }, res, Response)
    })

}