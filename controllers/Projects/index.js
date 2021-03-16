const DbHelpers = require("../../helpers/DbHelpers")
const Models = require("../../models/index")
const Response = require("../../helpers/ResponseClass")
const { failedStatus, failureCode, successStatus, successCode } = require("../../helpers")
const { logger } = require("../../loggers/logger")
const multer = require('multer')
const uploadFunction = require('../../helpers/multer')
const db = require("../../models/index")
const upload = uploadFunction('./uploads/projects')
var uploader = upload.single('attachment')

let dbHelper = new DbHelpers(Models, logger, failedStatus, successStatus, failureCode, successCode)


module.exports = {
    addProject: ('/', (req, res) => {

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
                let { title, description, team, endDate, supervisor } = req.body
                try {
                    let newTeam = await Models.team.create({
                        name: `${title}_${description}`
                    })

                    let membersArr = []
                    team = JSON.parse(team)
                    for (let i = 0; i < team.length; i++) {
                        let newObj = {
                            teamId: newTeam.id,
                            userId: team[i]
                        }

                        membersArr.push(newObj)
                    }


                    let newTeamMembers = await Models.team_members.bulkCreate(membersArr)

                    await dbHelper.createNewInstance("project", {
                        title: title,
                        description: description,
                        endDate: endDate,
                        userId: req.user.id,
                        teamId: newTeam.id,
                        supervisorId: supervisor,
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

    getAllProjects: ('/', async (req, res) => {
        let { endDate, title, supervisor, team, status, offset, limit } = req.query

        let whereObj = {}
        if (endDate && endDate !== "") {
            whereObj.endDate = endDate
        }
        if (title && title !== "") {
            whereObj.title = title
        }
        if (supervisor && supervisor !== "") {
            whereObj.supervisor = supervisor
        }
        if (team && team !== "") {
            whereObj.team = team
        }
        if (status && status !== "") {
            whereObj.status = status
        }

        await dbHelper.getPaginatedInstance("project", {
            where: whereObj,
            offset: offset ? Number(offset) : offset,
            limit: limit ? Number(limit) : 10,
            order: [['id', 'DESC']],
        }, res, Response)
    }),


    getSingleProject: ('/', async (req, res) => {
        let { id } = req.params

        await dbHelper.getSingleInstance("project", {
            where: {
                id: id
            },
            include: [{
                model: Models.user,
                as: 'user',
                attributes: ['firstname', 'lastname', 'email']
            },
            {
                model: Models.user,
                as: 'supervisor',
                attributes: ['firstname', 'lastname', 'email']
            },
            {
                model: Models.team,
                as: 'team',
                // attributes: ['first_name', 'last_name', 'other_name']
            },
            ]
        }, res, Response)
    }),


    getAllTasks: ('/', async (req, res) => {
        let { id } = req.params

        await dbHelper.getPaginatedInstance("task", {
            where: {
                projectId: id
            }
        }, res, Response)
    }),

    addTask: ('/', async (req, res) => {
        let response
        let { id } = req.params
        let { title, description } = req.body
        if (title.trim() == "") {
            response = new Response(failedStatus, "Validation error,title is required ", failureCode, {})
            return res.status(400)
                .send(response)
        }
        if (description.trim() == "") {
            response = new Response(failedStatus, "Validation error,description is required ", failureCode, {})
            return res.status(400)
                .send(response)
        }
        await dbHelper.createNewInstance("task", {
            title: req.body.title,
            description: req.body.description,
            projectId: id,
            status: "pending"
        }, res, Response)
    }),

    updateTask: ('/', async (req, res) => {
        let { id, taskId } = req.params
        await dbHelper.editInstance("task", {
            where: {
                id: taskId,
                projectId: id
            }
        }, {
            status: "completed"
        }, res, Response)
    }),

    deleteTask: ('/', async (req, res) => {
        let { id, taskId } = req.params
        await dbHelper.deleteInstance("task", {
            where: {
                id: taskId,
                projectId: id
            }
        }, res, Response)
    }),
    addTeam: ('/', async (req, res) => {
        let { name } = req.body
        let response
        if (name.trim() == "") {
            response = new Response(failedStatus, "Name is required", failureCode, {})
            return res.status(400).send(res)
        }

        await dbHelper.createNewInstance("team", {
            name: name
        }, res, Response)
    })
}