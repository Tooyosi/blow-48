const express = require('express');
const router = express.Router({ mergeParams: true });
const reportsController = require('../../controllers/Reports')
const { protected, authenticate, isUserOrAdmin, isAdmin } = require('../../middleware');



/**
* @swagger
* /report:
*   get:
*     summary:  Get all Reports route.
*     tags: [Report]

*     description: This route gets all Reports.
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
*         name: title  
*         schema:
*           type: string
*       - in: query
*         name: userId  
*         schema:
*           type: string
*     responses: 
*       200:
*         description: Receive back reports 
*       400:
*         description: Bad Request.
*/

router.get('/', authenticate, protected, reportsController.getAllReports)


/**
* @swagger
* /report/{id}:
*   get:
*     summary:  Get single Reports route.
*     tags: [Report]

*     description: This route gets single Reports.
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
*           description: The Report id
*     responses: 
*       200:
*         description: Receive back Services details 
*       400:
*         description: Bad Request.
*/

router.get('/:id', authenticate, protected, reportsController.getSingleReport)


/**
* @swagger
* /report/{id}:
*   patch:
*     summary:  Edit single Reports route.
*     tags: [Report]

*     description: This route edits single Reports.
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
*           description: The Report id
*       - in: body
*         name: body   
*         required: true
*         schema:
*            type: object
*            required:
*            properties:
*              title:
*                type: string
*              description:
*                type: string
*     responses: 
*       200:
*         description: Receive back edited Report details 
*       400:
*         description: Bad Request.
*/

router.patch('/:id', authenticate, protected, reportsController.editReport)

router.post('/',authenticate, protected,  reportsController.addReport)



/**
* @swagger
* /report/{id}:
*   delete:
*     summary:  Delete Report route.
*     tags: [Report]

*     description: This Route deletes a report.
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
*           description: The Report id
*     responses: 
*       200:
*         description: Successful.
*       400:
*         description: Bad Request.
*       401:
*         description: Unauthorized.
*/
router.delete('/:id',authenticate, protected, reportsController.deleteReport)


module.exports = router