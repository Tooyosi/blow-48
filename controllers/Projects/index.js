const DbHelpers = require("../../helpers/DbHelpers")
const Models = require("../../models/index")
const Response = require("../../helpers/ResponseClass")
const { failedStatus, failureCode, successStatus, successCode } = require("../../helpers")
const {logger} = require("../../loggers/logger")
const multer = require('multer')
const uploadFunction = require('../../helpers/multer')
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
                        supervisor: supervisor,
                        attachment: req.file? req.file.path: null
                    }, res, Response)

                } catch (error) {
                    console.log(error)
                    logger.error(error.toString())
                    response = new Response(failedStatus, error.toString(), failureCode, {})
                    return res.status(400)
                        .send(response)
                }
            }
        })

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