const express = require('express');
const router = express.Router({ mergeParams: true });
const userController = require('../../controllers/User/index')



/**
 * @swagger
 * tags:
 *   name: User
 *   description: User Routes
 */

/**
* @swagger
* /user/roles:
*   get:
*     summary:  Fetch all User roles .
*     tags: [User]

*     description: This Route fetches all User roles.
*     consumes:
*       — application/json
*     responses: 
*       200:
*         description: Success.
*       400:
*         description: Bad Request.
*/

router.get('/roles',  userController.getRoles)



/**
* @swagger
* /user/roles:
*   post:
*     summary:  User role create route.
*     tags: [User]

*     description: This route creates a User role.
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

router.post('/roles',  userController.addRole)

module.exports = router