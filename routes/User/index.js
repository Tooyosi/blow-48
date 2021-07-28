const express = require('express');
const router = express.Router({ mergeParams: true });
const userController = require('../../controllers/User/index');
const { authenticate,protected, isAdmin } = require('../../middleware');



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
*         name: offset   
*         schema:
*           type: string
*       - in: query
*         name: limit   
*         schema:
*           type: string
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


router.patch('/', authenticate, protected, userController.editUser)



/**
* @swagger
* /user/password:
*   patch:
*     summary:  Change Password Routes .
*     tags: [User]

*     description: This Route Changes logged in user's password.
*     consumes:
*       — application/json
*     parameters:
*       - name: Authorization
*         in: header
*         description: Bearer token
*         type: string
*         required: true
*       - in: body
*         name: body   
*         required: true
*         schema:
*            type: object
*            required:
*            properties:
*              oldPassword:
*                type: string
*              password:
*                type: string
*     responses: 
*       200:
*         description: Success.
*       400:
*         description: Bad Request.
*/

router.patch('/password',authenticate,  userController.editPassword)


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
* /user/{id}:
*   get:
*     summary:  Get single User route.
*     tags: [User]

*     description: This route gets single User.
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
*           description: The user id
*     responses: 
*       200:
*         description: Receive back all users 
*       400:
*         description: Bad Request.
*/

router.get('/:id',authenticate, protected,  userController.getUser)

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



/**
* @swagger
* /user/{id}/team:
*   get:
*     summary:  Get  User team route.
*     tags: [User]

*     description: This route gets a User's team.
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
*           description: The user id
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
*         description: Receive back user's team 
*       400:
*         description: Bad Request.
*/

router.get('/:id/team',authenticate, protected,  userController.getUserTeams)

/**
* @swagger
* /user/{id}/role:
*   patch:
*     summary:  Change user role .
*     tags: [User]

*     description: This Route Changes a user's role.
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
*           description: The user id
*       - in: body
*         name: body   
*         required: true
*         schema:
*            type: object
*            required:
*            properties:
*              roleId:
*                type: string
*     responses: 
*       200:
*         description: Success.
*       400:
*         description: Bad Request.
*/
router.patch('/:id/role', authenticate, protected, isAdmin,userController.editRole)

module.exports = router