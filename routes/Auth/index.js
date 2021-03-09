const express = require('express');
const router = express.Router({ mergeParams: true });
const AuthController = require('../../controllers/Auth/index')



/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Auth Routes
 */

/**
* @swagger
* /auth/signup:
*   post:
*     summary:  Signup routes .
*     tags: [Auth]

*     description: This route signups a writer the user.
*     consumes:
*       — application/json
*     parameters:
*       - in: body
*         name: body   
*         required: true
*         schema:
*            type: object
*            required:
*              -firstname
*              -lastname
*              -gender
*              -phone
*              -email
*              -role
*              -password
*            properties:
*              firstname:
*                type: string
*              lastname:
*                type: string
*              gender:
*                type: string
*              phone:
*                type: number
*              country:
*                type: string
*              email:
*                type: string
*              password:
*                type: string
*              address:
*                type: string
*              account_number:
*                type: string
*              role:
*                type: string
*     responses: 
*       200:
*         description: Success.
*       400:
*         description: Bad Request.
*/

router.post('/signup',  AuthController.postSignup)

/**
* @swagger
* /auth/resend-otp:
*   post:
*     summary:  Signup otp routes .
*     tags: [Auth]

*     description: This route resends signup otp.
*     consumes:
*       — application/json
*     parameters:
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
*         description: Success.
*       400:
*         description: Bad Request.
*/

router.post('/resend-otp',  AuthController.resendOtp)


/**
* @swagger
* /auth/verify-otp/{id}:
*   post:
*     summary:  Signup otp routes .
*     tags: [Auth]

*     description: This route resends signup otp.
*     consumes:
*       — application/json
*     parameters:
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
*              -otp
*            properties:
*              otp:
*                type: string
*     responses: 
*       200:
*         description: Success.
*       400:
*         description: Bad Request.
*/

router.post('/verify-otp/:id',  AuthController.verifyOtp)


module.exports = router