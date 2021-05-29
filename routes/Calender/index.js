const express = require('express');
const router = express.Router({ mergeParams: true });
const calenderController = require('../../controllers/Calender')
const { protected, authenticate, isUserOrAdmin, isAdmin } = require('../../middleware');

/**
* @swagger
* /calender:
*   post:
*     summary:  Add new calender route.
*     tags: [Calender]

*     description: This route adds a new calender.
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
*              name:
*                type: string
*              startTime:
*                type: string
*              endTime:
*                type: string
*              description:
*                type: string
*              membersArr:
*                type: array
*                items:
*                   type: string 
*     responses: 
*       200:
*         description: Receive back Services details 
*       400:
*         description: Bad Request.
*/


router.post('/',authenticate, protected,  calenderController.addCalender)


/**
* @swagger
* /calender:
*   get:
*     summary:  Get all calender route.
*     tags: [Calender]

*     description: This route gets all calender.
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
*         name: name  
*         schema:
*           type: string
*       - in: query
*         name: endTime  
*         schema:
*           type: string
*       - in: query
*         name: startTime  
*         schema:
*           type: string
*     responses: 
*       200:
*         description: Receive back Services details 
*       400:
*         description: Bad Request.
*/

router.get('/',authenticate, protected,  calenderController.getCalenders)


/**
* @swagger
* /calender/{id}:
*   delete:
*     summary:  Delete calender route.
*     tags: [Calender]

*     description: This route deletes a calender.
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
*           description: The calender id
*     responses: 
*       200:
*         description: Receive back Services details 
*       400:
*         description: Bad Request.
*/

router.delete('/:id',authenticate, protected,  calenderController.deleteCalender)



/**
* @swagger
* /calender/{id}/member:
*   get:
*     summary:  Get Calender memberd.
*     tags: [Calender]

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
*           description: The calender id
*     responses: 
*       200:
*         description: Successful.
*       400:
*         description: Bad Request.
*       401:
*         description: Unauthorized.
*/
router.get('/:id/member',authenticate, protected, calenderController.getCalenderMembers)


/**
* @swagger
* /calender/{id}/member:
*   post:
*     summary:  Update Calenders team route.
*     tags: [Calender]

*     description: This Route adds a calender member.
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
*           description: The Calender id
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
router.post('/:id/member',authenticate, protected, calenderController.addCalenderMember)


/**
* @swagger
* /calender/{id}/member/{userId}:
*   patch:
*     summary:  Update Calenders team route.
*     tags: [Calender]

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
*           description: The Calender id
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
router.patch('/:id/member/:userId',authenticate, protected, calenderController.editMember)


/**
* @swagger
* /calender/{id}/member/{userId}:
*   delete:
*     summary:  Delete member.
*     tags: [Calender]

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
*           description: The Calender id
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
router.delete('/:id/member/:userId',authenticate, protected, calenderController.deleteMember)

module.exports = router