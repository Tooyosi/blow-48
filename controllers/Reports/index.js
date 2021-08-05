const DbHelpers = require("../../helpers/DbHelpers")
const Models = require("../../models/index")
const Response = require("../../helpers/ResponseClass")
const { failedStatus, failureCode, successStatus, successCode } = require("../../helpers")
const { logger } = require("../../loggers/logger")
const multer = require('multer')
const uploadFunction = require('../../helpers/multer')
const db = require("../../models/index")
const upload = uploadFunction('./uploads/reports')
var uploader = upload.single('attachment')
const fs = require('fs')

let dbHelper = new DbHelpers(Models, logger, failedStatus, successStatus, failureCode, successCode)


module.exports = {
    addReport: ('/', (req, res) => {

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
            } else {
                let { title, description } = req.body
                try {

                    await dbHelper.createNewInstance("report", {
                        title: title,
                        description: description,
                        userId: req.user.id,
                        attachment: req.file ? req.file.path : null
                    }, res, Response)

                } catch (error) {
                    logger.error(error.toString())
                    response = new Response(failedStatus, error.toString(), failureCode, {})
                    return res.status(400)
                        .send(response)
                }
            }
        })

    }),

    getAllReports: ('/', async (req, res) => {
        let { title, userId, offset, limit } = req.query

        let whereObj = {}
        if (title && title !== "") {
            whereObj.title = title
        }

        if (userId && userId !== "") {
            whereObj.userId = userId
        }


        await dbHelper.getPaginatedInstance("report", {
            where: whereObj,
            include: [{
                model: Models.user,
                as: 'user',
                attributes: ['firstname', 'lastname', 'email', "img_url"],
                include: {
                    model: Models.user_role,
                    as: 'user_role',
                    attributes: ['role']

                }
            }],
            offset: offset ? Number(offset) : offset,
            limit: limit ? Number(limit) : 10,
            order: [['id', 'DESC']],
        }, res, Response)
    }),


    getSingleReport: ('/', async (req, res) => {
        let { id } = req.params

        await dbHelper.getSingleInstance("report", {
            where: {
                id: id
            },
            include: [{
                model: Models.user,
                as: 'user',
                attributes: ['firstname', 'lastname', 'email', "img_url"],
                include: {
                    model: Models.user_role,
                    as: 'user_role',
                    attributes: ['role']

                }
            },]
        }, res, Response)
    }),

    editReport: ('/', async (req, res) => {
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
            } else {
                let { id } = req.params
                let { title, description } = req.body
                let bodyObj = {}
                let response
                if (title && title.trim() !== "") {
                    bodyObj.title = title
                }

                if (description && description.trim() !== "") {
                    bodyObj.description = description
                }
                try {

                    let foundReport = await Models.report.findOne({
                        where: {
                            id: id
                        }
                    })

                    if (!foundReport) {
                        response = new Response(failedStatus, "Report Not Found", failureCode, {})
                        return res.status(404)
                            .send(response)
                    }
                    if (req.file && req.file.path) {
                        if (foundReport.attachment !== null) {
                            try {
                                fs.unlinkSync(`./${foundReport.attachment}`)                                
                            } catch (error) {
                                
                            }
                        }

                        bodyObj.attachment = req.file.path
                    }

                    await dbHelper.editInstance("report", {
                        where: {
                            id: id
                        },
                    }, bodyObj, res, Response)

                } catch (error) {
                    logger.error(error.toString())
                    response = new Response(failedStatus, error.toString(), failureCode, {})
                    return res.status(400)
                        .send(response)
                }
            }
        })
    }),
    deleteReport: ('/', async (req, res) => {
        let { id } = req.params
        let response

        try {

            let foundReport = await Models.report.findOne({
                where: {
                    id: id
                }
            })

            if (!foundReport) {
                response = new Response(failedStatus, "Report Not Found", failureCode, {})
                return res.status(404)
                    .send(response)
            }

            if (foundReport.attachment !== null) {
                try {
                    fs.unlinkSync(`./${foundReport.attachment}`)                    
                } catch (error) {
                    
                }
            }
            await dbHelper.deleteInstance("report", {
                where: {
                    id: id
                },
            }, res, Response)

        } catch (error) {
            logger.error(error.toString())
            response = new Response(failedStatus, error.toString(), failureCode, {})
            return res.status(400)
                .send(response)
        }
    })
}