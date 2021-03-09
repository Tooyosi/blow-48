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
* /auth/login:
*   post:
*     summary:  Auth Login Route .
*     tags: [Auth]

*     description: This route authenticates the user.
*     consumes:
*       — application/json
*     parameters:
*       - in: body
*         name: body   
*         required: true
*         schema:
*            type: object
*            required:
*              -email
*              -password
*            properties:
*              email:
*                type: string
*              password:
*                type: string
*     responses: 
*       200:
*         description: Receive back User details and auth token.
*       400:
*         description: Bad Request.
*/
router.post('/login', AuthController.postLogin)


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
*              -email
*            properties:
*              email:
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


/**
* @swagger
* /auth/forgot:
*   post:
*     summary:  User forgot password Route .
*     tags: [Auth]

*     description: This Route creates a refresh token for user password.
*     consumes:
*       — application/json
*     parameters:
*       - in: body
*         name: body   
*         required: true
*         schema:
*            type: object
*            required:
*              -email
*            properties:
*              email:
*                type: string
*     responses: 
*       200:
*         description: Successful.
*       400:
*         description: Bad Request.
*       401:
*         description: Unauthorized.
*/
router.post('/forgot', AuthController.postPasswordReset)


/**
* @swagger
* /auth/reset/{token}:
*   get:
*     summary:  User forgot password Route .
*     tags: [Auth]

*     description: This Route creates a refresh token for user password.
*     consumes:
*       — application/json
*     parameters:
*       - in: path
*         name: token   
*         required: true
*         schema:
*           type: integer
*           minimum: 1
*           description: The user reset password token
*     responses: 
*       200:
*         description: Successful.
*       400:
*         description: Bad Request.
*       401:
*         description: Unauthorized.
*/
router.get('/reset/:token', AuthController.getResetToken)


/**
* @swagger
* /auth/reset/{token}:
*   post:
*     summary:  User forgot password Route .
*     tags: [Auth]

*     description: This Route creates a refresh token for user password.
*     consumes:
*       — application/json
*     parameters:
*       - in: path
*         name: token   
*         required: true
*         schema:
*           type: integer
*           minimum: 1
*           description: The user reset password token
*       - in: body
*         name: body   
*         required: true
*         schema:
*            type: object
*            required:
*              -password
*            properties:
*              password:
*                type: string
*     responses: 
*       200:
*         description: Successful.
*       400:
*         description: Bad Request.
*       401:
*         description: Unauthorized.
*/
router.post('/reset/:token', AuthController.postReset)
module.exports = router