const express = require('express');
const router = express.Router({ mergeParams: true });
const userController = require('../../controllers/User/index');
const { authenticate,protected } = require('../../middleware');



/**
 * @swagger
 * tags:
 *   name: User
 *   description: User Routes
 */

/**
* @swagger
* /user:
*   get:
*     summary:  Get all User route.
*     tags: [User]

*     description: This route gets all Users.
*     consumes:
*       — application/json
*     parameters:
*       - name: Authorization
*         in: header
*         description: Bearer token
*         type: string
*         required: true
*       - in: query
*         name: firstName   
*         schema:
*           type: string
*       - in: query
*         name: lastName   
*         schema:
*           type: string
*       - in: query
*         name: roleId  
*         schema:
*           type: string
*       - in: query
*         name: email  
*         schema:
*           type: string
*       - in: query
*     responses: 
*       200:
*         description: Receive back all users 
*       400:
*         description: Bad Request.
*/

router.get('/',authenticate, protected,  userController.getAllUsers)



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