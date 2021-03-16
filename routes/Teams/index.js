const express = require('express');
const router = express.Router({ mergeParams: true });
const teamController = require('../../controllers/teams')
const { protected, authenticate, isUserOrAdmin, isAdmin } = require('../../middleware');



/**
 * @swagger
 * tags:
 *   name: team
 *   description: team Routes
 */



/**
* @swagger
* /team:
*   post:
*     summary:  team  create route.
*     tags: [team]

*     description: This route creates a team.
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
*              -name
*            properties:
*              name:
*                type: string
*     responses: 
*       200:
*         description: Receive back Services details 
*       400:
*         description: Bad Request.
*/

router.post('/', authenticate, protected, teamController.addTeam)

module.exports = router