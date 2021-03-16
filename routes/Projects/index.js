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



module.exports = router