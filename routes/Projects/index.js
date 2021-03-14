const express = require('express');
const router = express.Router({ mergeParams: true });
const projectController = require('../../controllers/Projects')
const { protected, authenticate, isUserOrAdmin, isAdmin } = require('../../middleware');



/**
 * @swagger
 * tags:
 *   name: Project
 *   description: Project Routes
 */

/**
* @swagger
* /project/teams:
*   get:
*     summary:  Add project team routes .
*     tags: [Project]

*     description: This Route adds team.
*     consumes:
*       — application/json
*     responses: 
*       200:
*         description: Success.
*       400:
*         description: Bad Request.
*/

// router.get('/roles',  projectController.getRoles)



/**
* @swagger
* /Project/roles:
*   post:
*     summary:  Project role create route.
*     tags: [Project]

*     description: This route creates a Project role.
*     consumes:
*       — application/json
*     parameters:
*       - in: body
*         name: body   
*         required: true
*         schema:
*            type: object
*            required:
*              -role
*            properties:
*              role:
*                type: string
*     responses: 
*       200:
*         description: Receive back Services details 
*       400:
*         description: Bad Request.
*/

// router.post('/roles',  projectController.addRole)

router.post('/',authenticate, protected,  projectController.addProject)


module.exports = router