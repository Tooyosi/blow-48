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
        let { endDate, title, supervisor, userId, team, status, offset, limit } = req.query

        let whereObj = {}
        if (endDate && endDate !== "") {
            whereObj.endDate = endDate
        }
        if (title && title !== "") {
            whereObj.title = title
        }
        if (supervisor && supervisor !== "") {
            whereObj.supervisorId = supervisor
        }
        if (userId && userId !== "") {
            whereObj.userId = userId
        }
        if (team && team !== "") {
            whereObj.team = team
        }
        if (status && status !== "") {
            whereObj.status = status
        }

        await dbHelper.getPaginatedInstance("project", {
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
            },
            {
                model: Models.user,
                as: 'supervisor',
                attributes: ['firstname', 'lastname', 'email', "img_url"]
            },
            {
                model: Models.team,
                as: 'team',
                // attributes: ['first_name', 'last_name', 'other_name']
            },
            ],
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
                attributes: ['firstname', 'lastname', 'email', "img_url"],
                include: {
                    model: Models.user_role,
                    as: 'user_role',
                    attributes: ['role']

                }
            },
            {
                model: Models.user,
                as: 'supervisor',
                attributes: ['firstname', 'lastname', 'email', "img_url"]
            },
            {
                model: Models.team,
                as: 'team',
                // attributes: ['first_name', 'last_name', 'other_name']
            },
            ]
        }, res, Response)
    }),

    editProject: ('/', async (req, res) => {
        let { id } = req.params
        let {status, supervisor, endDate, title, description } = req.body
        let bodyObj = {}
        let response
        if(status && status.trim() !== ""){
            bodyObj.status = status
        }

        if(endDate && endDate.trim() !== ""){
            bodyObj.endDate = endDate
        }

        if(title && title.trim() !== ""){
            bodyObj.title = title
        }

        if(description && description.trim() !== ""){
            bodyObj.description = description
        }
        if(supervisor && supervisor.trim() !== ""){
            let foundSupervisor = await Models.user.findOne({
                where:{
                    id: supervisor
                }
            })

            if(foundSupervisor == null || foundSupervisor == undefined){
                response = new Response(failedStatus, "User not found", failureCode, {})
                return res.status(404)
                    .send(response)
            }
            bodyObj.supervisorId = supervisor
        }
    
        await dbHelper.editInstance("project", {
            where: {
                id: id
            },
        },bodyObj, res, Response)
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
        let response
        let newStatus = "completed"
        try {
            let gottenTask = await Models.task.findOne({
                where: {
                    id: taskId,
                    projectId: id
                }
            })

            if(gottenTask && gottenTask.status == "completed"){
                newStatus = "pending"
            }
            await dbHelper.editInstance("task", {
                where: {
                    id: taskId,
                    projectId: id
                }
            }, {
                status: newStatus
            }, res, Response)
            
        } catch (error) {
            logger.error(error.toString())
            response = new Response(failedStatus, error.toString(), failureCode, {})
            return res.status(400)
                .send(response)
            
        }
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
    }),
    addTeamMember: ('/', async (req, res) => {
        let { userId } = req.body
        let { id } = req.params
        let response
        try {

            let foundProject = await Models.project.findOne({
                where: {
                    id: id
                }
            })

            if (foundProject == null || foundProject == undefined) {

                response = new Response(failedStatus, "Project not found", failureCode, {})
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

            let userInTeam = await Models.team_members.findOne({
                where: {
                    teamId: foundProject.teamId,
                    userId: userId
                }
            })

            if (userInTeam !== null && userInTeam !== undefined) {

                response = new Response(failedStatus, "User is already on this team", failureCode, {})
                return res.status(400)
                    .send(response)
            }
            await dbHelper.createNewInstance("team_members", {
                teamId: foundProject.teamId,
                userId: userId
            }, res, Response)

        } catch (error) {
            logger.error(error.toString())
            response = new Response(failedStatus, error.toString(), failureCode, {})
            return res.status(400)
                .send(response)

        }
    }),

    deleteTeamMember: ('/', async (req, res) => {
        let { id, userId } = req.params
        try {

            let foundProject = await Models.project.findOne({
                where: {
                    id: id
                }
            })

            if (foundProject == null || foundProject == undefined) {

                response = new Response(failedStatus, "Project not found", failureCode, {})
                return res.status(404)
                    .send(response)

            }

            await dbHelper.deleteInstance("team_members", {
                where: {
                    teamId: foundProject.teamId,
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

    editTeamMember: ('/', async (req, res) => {
        let { newUserId } = req.body
        let { id, userId } = req.params
        let response

        if (!newUserId || newUserId.trim() == "") {

            response = new Response(failedStatus, "New UserId is required", failureCode, {})
            return res.status(404)
                .send(response)
        }
        try {

            let foundProject = await Models.project.findOne({
                where: {
                    id: id
                }
            })

            if (foundProject == null || foundProject == undefined) {

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

            let userInTeam = await Models.team_members.findOne({
                where: {
                    teamId: foundProject.teamId,
                    userId: newUserId
                }
            })

            if (userInTeam !== null && userInTeam !== undefined) {

                response = new Response(failedStatus, "User is already on this team", failureCode, {})
                return res.status(400)
                    .send(response)
            }
            await dbHelper.editInstance("team_members", {
                where: {
                    teamId: foundProject.teamId,
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

    addComment: ('/', async (req, res) => {
        let { comment } = req.body
        let { id } = req.params
        let response
        if (!comment || comment.trim() == "") {
            response = new Response(failedStatus, "Comment is required", failureCode, {})
            return res.status(400).send(response)
        }
        try {
            let project = await Models.project.findOne({
                where: {
                    id: id
                }
            })

            if (project == null || project == undefined) {
                response = new Response(failedStatus, "Project not found", failureCode, {})
                return res.status(404).send(response)
            }

            let teamMember = await Models.team_members.findOne({
                where: {
                    teamId: project.teamId,
                    userId: req.user.id
                }
            })
            if (teamMember == null || teamMember == undefined) {
                response = new Response(failedStatus, "You are not a team member on this project", failureCode, {})
                return res.status(404).send(response)
            }

            await dbHelper.createNewInstance("comment", {
                comment: comment,
                projectId: id,
                userId: req.user.id
            }, res, Response)

        } catch (error) {
            logger.error(error.toString())
            response = new Response(failedStatus, error.toString(), failureCode, {})
            return res.status(400)
                .send(response)
        }
    }),

    getAllComments: ('/', async (req, res) => {
        let { id } = req.params
        let { offset, limit } = req.query

        let whereObj = {
            projectId: id,
            isHidden: false
        }

        await dbHelper.getPaginatedInstance("comment", {
            where: whereObj,
            include: {
                model: Models.user,
                as: 'user',
                attributes: ['firstname', 'lastname', 'email'],
                include: {
                    model: Models.user_role,
                    as: 'user_role',
                    attributes: ['role']

                }
            },
            offset: offset ? Number(offset) : offset,
            limit: limit ? Number(limit) : 10,
            order: [['id', 'DESC']],
        }, res, Response)
    }),

    updateComment: ('/', async (req, res) => {
        let { comment } = req.body
        let { id, commentId } = req.params
        let response
        if (!comment || comment.trim() == "") {
            response = new Response(failedStatus, "Comment is required", failureCode, {})
            return res.status(400).send(response)
        }

        await dbHelper.editInstance("comment", {
            where: {
                id: commentId,
                projectId: id,
                userId: req.user.id
            }
        }, {
            comment: comment
        }, res, Response)
    }),

    hideComment: ('/', async (req, res) => {
        let { id, commentId } = req.params
        let response
        await dbHelper.deleteInstance("comment", {
            where: {
                id: commentId,
                projectId: id,
                userId: req.user.id,
            }
        }, res, Response)
    }),
}