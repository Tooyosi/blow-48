const express = require('express');
const router = express.Router({ mergeParams: true });
const projectController = require('../../controllers/Projects')
const { protected, authenticate, isUserOrAdmin, isAdmin } = require('../../middleware');



/**
* @swagger
* /project:
*   get:
*     summary:  Get all projects route.
*     tags: [Project]

*     description: This route gets all projects.
*     consumes:
*       — application/json
*     parameters:
*       - name: Authorization
*         in: header
*         description: Bearer token
*         type: string
*         required: true
*       - in: query
*         name: offset   
*         schema:
*           type: string
*       - in: query
*         name: limit   
*         schema:
*           type: string
*       - in: query
*         name: endDate  
*         schema:
*           type: string
*       - in: query
*         name: title  
*         schema:
*           type: string
*       - in: query
*         name: userId  
*         schema:
*           type: string
*       - in: query
*         name: supervisor  
*         schema:
*           type: string
*       - in: query
*         name: team  
*         schema:
*           type: string
*       - in: query
*         name: status  
*         schema:
*           type: string
*     responses: 
*       200:
*         description: Receive back Services details 
*       400:
*         description: Bad Request.
*/

router.get('/', authenticate, protected, projectController.getAllProjects)


/**
* @swagger
* /project/{id}:
*   get:
*     summary:  Get single projects route.
*     tags: [Project]

*     description: This route gets single projects.
*     consumes:
*       — application/json
*     parameters:
*       - name: Authorization
*         in: header
*         description: Bearer token
*         type: string
*         required: true
*       - in: path
*         name: id  
*         required: true
*         schema:
*           type: integer
*           minimum: 1
*           description: The project id
*     responses: 
*       200:
*         description: Receive back Services details 
*       400:
*         description: Bad Request.
*/

router.get('/:id', authenticate, protected, projectController.getSingleProject)


/**
* @swagger
* /project/{id}:
*   patch:
*     summary:  Edit single projects route.
*     tags: [Project]

*     description: This route edits single projects.
*     consumes:
*       — application/json
*     parameters:
*       - name: Authorization
*         in: header
*         description: Bearer token
*         type: string
*         required: true
*       - in: path
*         name: id  
*         required: true
*         schema:
*           type: integer
*           minimum: 1
*           description: The project id
*       - in: body
*         name: body   
*         required: true
*         schema:
*            type: object
*            required:
*            properties:
*              status:
*                type: string
*              supervisor:
*                type: string
*              endDate:
*                type: string
*              title:
*                type: string
*              description:
*                type: string
*     responses: 
*       200:
*         description: Receive back edited project details 
*       400:
*         description: Bad Request.
*/

router.patch('/:id', authenticate, protected, projectController.editProject)

router.post('/',authenticate, protected,  projectController.addProject)



/**
* @swagger
* /project/{id}/task:
*   get:
*     summary:  Get all projects tasks route.
*     tags: [Project]

*     description: This route gets all project tasks.
*     consumes:
*       — application/json
*     parameters:
*       - name: Authorization
*         in: header
*         description: Bearer token
*         type: string
*         required: true
*       - in: path
*         name: id  
*         required: true
*         schema:
*           type: integer
*           minimum: 1
*           description: The project id
*       - in: query
*         name: offset   
*         schema:
*           type: string
*       - in: query
*         name: limit   
*         schema:
*           type: string
*     responses: 
*       200:
*         description: Receive back project tasks 
*       400:
*         description: Bad Request.
*/

router.get('/:id/task', authenticate, protected, projectController.getAllTasks)


/**
* @swagger
* /project/{id}/task:
*   post:
*     summary:  Get all projects tasks route.
*     tags: [Project]

*     description: This Route creates a new task.
*     consumes:
*       — application/json
*     parameters:
*       - name: Authorization
*         in: header
*         description: Bearer token
*         type: string
*         required: true
*       - in: path
*         name: id  
*         required: true
*         schema:
*           type: integer
*           minimum: 1
*           description: The project id
*       - in: body
*         name: body   
*         required: true
*         schema:
*            type: object
*            required:
*              -title
*              -description
*            properties:
*              title:
*                type: string
*              description:
*                type: string
*     responses: 
*       200:
*         description: Successful.
*       400:
*         description: Bad Request.
*       401:
*         description: Unauthorized.
*/
router.post('/:id/task',authenticate, protected, projectController.addTask)


/**
* @swagger
* /project/{id}/task/{taskId}:
*   patch:
*     summary:  Update projects tasks status route.
*     tags: [Project]

*     description: This Route updates a task.
*     consumes:
*       — application/json
*     parameters:
*       - name: Authorization
*         in: header
*         description: Bearer token
*         type: string
*         required: true
*       - in: path
*         name: id  
*         required: true
*         schema:
*           type: integer
*           minimum: 1
*           description: The project id
*       - in: path
*         name: taskId  
*         required: true
*         schema:
*           type: integer
*           minimum: 1
*           description: The task id
*     responses: 
*       200:
*         description: Successful.
*       400:
*         description: Bad Request.
*       401:
*         description: Unauthorized.
*/
router.patch('/:id/task/:taskId',authenticate, protected, projectController.updateTask)



/**
* @swagger
* /project/{id}/task/{taskId}:
*   delete:
*     summary:  Delete project tasks route.
*     tags: [Project]

*     description: This Route deletes a task.
*     consumes:
*       — application/json
*     parameters:
*       - name: Authorization
*         in: header
*         description: Bearer token
*         type: string
*         required: true
*       - in: path
*         name: id  
*         required: true
*         schema:
*           type: integer
*           minimum: 1
*           description: The project id
*       - in: path
*         name: taskId  
*         required: true
*         schema:
*           type: integer
*           minimum: 1
*           description: The task id
*     responses: 
*       200:
*         description: Successful.
*       400:
*         description: Bad Request.
*       401:
*         description: Unauthorized.
*/
router.delete('/:id/task/:taskId',authenticate, protected, projectController.deleteTask)



/**
* @swagger
* /project/{id}/comment:
*   post:
*     summary:  Add comment route.
*     tags: [Project]

*     description: This Route creates a new comment.
*     consumes:
*       — application/json
*     parameters:
*       - name: Authorization
*         in: header
*         description: Bearer token
*         type: string
*         required: true
*       - in: path
*         name: id  
*         required: true
*         schema:
*           type: integer
*           minimum: 1
*           description: The project id
*       - in: body
*         name: body   
*         required: true
*         schema:
*            type: object
*            required:
*              -comment
*            properties:
*              comment:
*                type: string
*     responses: 
*       200:
*         description: Successful.
*       400:
*         description: Bad Request.
*       401:
*         description: Unauthorized.
*/
router.post('/:id/comment',authenticate, protected, projectController.addComment)



/**
* @swagger
* /project/{id}/comment:
*   get:
*     summary:  Get all projects comments route.
*     tags: [Project]

*     description: This route gets all project comments.
*     consumes:
*       — application/json
*     parameters:
*       - name: Authorization
*         in: header
*         description: Bearer token
*         type: string
*         required: true
*       - in: path
*         name: id  
*         required: true
*         schema:
*           type: integer
*           minimum: 1
*           description: The project id
*       - in: query
*         name: offset   
*         schema:
*           type: string
*       - in: query
*         name: limit   
*         schema:
*           type: string
*     responses: 
*       200:
*         description: Receive back project comments 
*       400:
*         description: Bad Request.
*/

router.get('/:id/comment', authenticate, protected, projectController.getAllComments)


/**
* @swagger
* /project/{id}/comment/{commentId}:
*   patch:
*     summary:  Update projects comment route.
*     tags: [Project]

*     description: This Route updates a comment.
*     consumes:
*       — application/json
*     parameters:
*       - name: Authorization
*         in: header
*         description: Bearer token
*         type: string
*         required: true
*       - in: path
*         name: id  
*         required: true
*         schema:
*           type: integer
*           minimum: 1
*           description: The project id
*       - in: path
*         name: commentId  
*         required: true
*         schema:
*           type: integer
*           minimum: 1
*           description: The comment id
*       - in: body
*         name: body   
*         required: true
*         schema:
*            type: object
*            required:
*              -comment
*            properties:
*              comment:
*                type: string
*     responses: 
*       200:
*         description: Successful.
*       400:
*         description: Bad Request.
*       401:
*         description: Unauthorized.
*/
router.patch('/:id/comment/:commentId',authenticate, protected, projectController.updateComment)


/**
* @swagger
* /project/{id}/comment/{commentId}:
*   delete:
*     summary:  Update projects comment route.
*     tags: [Project]

*     description: This Route updates a comment.
*     consumes:
*       — application/json
*     parameters:
*       - name: Authorization
*         in: header
*         description: Bearer token
*         type: string
*         required: true
*       - in: path
*         name: id  
*         required: true
*         schema:
*           type: integer
*           minimum: 1
*           description: The project id
*       - in: path
*         name: commentId  
*         required: true
*         schema:
*           type: integer
*           minimum: 1
*           description: The comment id
*     responses: 
*       200:
*         description: Successful.
*       400:
*         description: Bad Request.
*       401:
*         description: Unauthorized.
*/
router.delete('/:id/comment/:commentId',authenticate, protected, projectController.hideComment)

/**
* @swagger
* /project/{id}/team/member:
*   get:
*     summary:  Update projects team route.
*     tags: [Project]

*     description: This Route gets all team members.
*     consumes:
*       — application/json
*     parameters:
*       - name: Authorization
*         in: header
*         description: Bearer token
*         type: string
*         required: true
*       - in: path
*         name: id  
*         required: true
*         schema:
*           type: integer
*           minimum: 1
*           description: The project id
*     responses: 
*       200:
*         description: Successful.
*       400:
*         description: Bad Request.
*       401:
*         description: Unauthorized.
*/
router.get('/:id/team/member',authenticate, protected, projectController.getTeamMembers)


/**
* @swagger
* /project/{id}/team/member:
*   post:
*     summary:  Update projects team route.
*     tags: [Project]

*     description: This Route adds a team member.
*     consumes:
*       — application/json
*     parameters:
*       - name: Authorization
*         in: header
*         description: Bearer token
*         type: string
*         required: true
*       - in: path
*         name: id  
*         required: true
*         schema:
*           type: integer
*           minimum: 1
*           description: The project id
*       - in: body
*         name: body   
*         required: true
*         schema:
*            type: object
*            required:
*              -userId
*            properties:
*              userId:
*                type: string
*     responses: 
*       200:
*         description: Successful.
*       400:
*         description: Bad Request.
*       401:
*         description: Unauthorized.
*/
router.post('/:id/team/member',authenticate, protected, projectController.addTeamMember)

/**
* @swagger
* /project/{id}/team/member/{userId}:
*   patch:
*     summary:  Update projects team route.
*     tags: [Project]

*     description: This Route edits a team member.
*     consumes:
*       — application/json
*     parameters:
*       - name: Authorization
*         in: header
*         description: Bearer token
*         type: string
*         required: true
*       - in: path
*         name: id  
*         required: true
*         schema:
*           type: integer
*           minimum: 1
*           description: The project id
*       - in: path
*         name: userId  
*         required: true
*         schema:
*           type: integer
*           minimum: 1
*           description: The user id
*       - in: body
*         name: body   
*         required: true
*         schema:
*            type: object
*            required:
*              -newUserId
*            properties:
*              newUserId:
*                type: string
*     responses: 
*       200:
*         description: Successful.
*       400:
*         description: Bad Request.
*       401:
*         description: Unauthorized.
*/
router.patch('/:id/team/member/:userId',authenticate, protected, projectController.editTeamMember)



/**
* @swagger
* /project/{id}/team/member/{userId}:
*   delete:
*     summary:  Update projects team route.
*     tags: [Project]

*     description: This Route deletes a team member.
*     consumes:
*       — application/json
*     parameters:
*       - name: Authorization
*         in: header
*         description: Bearer token
*         type: string
*         required: true
*       - in: path
*         name: id  
*         required: true
*         schema:
*           type: integer
*           minimum: 1
*           description: The project id
*       - in: path
*         name: userId  
*         required: true
*         schema:
*           type: integer
*           minimum: 1
*           description: The user id
*     responses: 
*       200:
*         description: Successful.
*       400:
*         description: Bad Request.
*       401:
*         description: Unauthorized.
*/
router.delete('/:id/team/member/:userId',authenticate, protected, projectController.deleteTeamMember)


module.exports = router