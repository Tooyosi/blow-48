const { failedStatus, successStatus, successCode, failureCode, isBodyEmpty, bin2hashData, addMinutes } = require('../../helpers')
const Response = require("../../helpers/ResponseClass")
const SendMail = require("../../helpers/SendMail")
const passport = require("../../helpers/passport")
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const moment = require('moment-timezone')
const { logger } = require('../../loggers/logger')
const multer = require('multer')
const uploadFunction = require('../../helpers/multer')
const upload = uploadFunction('./uploads/writers/kyc')
var uploader = upload.single('guarantors ')

const DbHelpers = require("../../helpers/DbHelpers")
const Models = require("../../models/index")
let dbHelper = new DbHelpers(Models, logger, failedStatus, successStatus, failureCode, successCode)

module.exports = {
    postLogin: function (req, res, next) {
        let response, dateTime
        dateTime = moment.tz(Date.now(), "Africa/Lagos").format().slice(0, 19).replace('T', ' ')
        passport.authenticate('local', { session: false }, (err, user, info) => {
            if (err || !user) {
                let resp = info ? info : err.toString()
                response = new Response(failedStatus, resp, failureCode, {})
                return res.status(404).send(response)
            } else if (info) {
                let resp = info;

                response = new Response(failedStatus, resp, failureCode, {})
                return res.status(404).send(response)
            }
            req.logIn(user, async function (err) {
                if (err) {
                    let resp = err.toString()
                    response = new Response(failedStatus, resp, failureCode, {})
                    return res.status(404).send(response)
                }



                req.token = jwt.sign({
                    id: req.user.id,
                    isManagement: req.user.user_role.dataValues.role == "Management" ? true : false,
                    isProjectManager: req.user.user_role.dataValues.role == "Project Manager" ? true : false,
                    isAccountant: req.user.user_role.dataValues.role == "Accountants" ? true : false,
                    isAmbassador: req.user.user_role.dataValues.role == "Ambassadors" ? true : false,
                }, process.env.SESSION_SECRET, {
                    expiresIn: '24 hours'
                });


                let updateUser = await Models.user.findOne({
                    where: {
                        id: req.user.id
                    }
                })

                await updateUser.update({
                    last_login: dateTime,
                })
                response = new Response(successStatus, "Successful", successCode, { ...user, access_token: req.token })
                return res.status(200).send(response);
            });
        })(req, res, next);
    },

    postSignup: ('/', async (req, res) => {
        let response
        uploader(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                logger.error(`error during signup: ${err.message ? JSON.parse(err.message) : err.toString()}, payload: ${JSON.stringify(req.body)}`)
                response = new Response(failedStatus, err.message ? err.message : err.toString(), failureCode, {})
                return res.status(400)
                    .send(response)
            } else if (err) {
            }
            else {
                let {
                    firstname,
                    lastname,
                    gender,
                    email,
                    phone,
                    address,
                    bank_name,
                    account_number,
                    role,
                    password,
                } = req.body
                try {


                    let isEmpty = await isBodyEmpty({
                        firstname,
                        lastname,
                        gender,
                        email,
                        phone,
                        address,
                        bank_name,
                        account_number,
                        role,
                        password,
                    })


                } catch (error) {
                    response = new Response(failedStatus, "One or more body parameters are invalid", failureCode, {})
                    return res.status(400)
                        .send(response)

                }
                let newUSer
                try {

                    let oldUser = await Models.user.findOne({ where: { email } })

                    if (oldUser !== null && oldUser !== undefined) {
                        response = new Response(failedStatus, "User Already Exists", failureCode, {})
                        return res.status(400)
                            .send(response)
                    }
                    newUSer = await Models.user.create({
                        firstname,
                        lastname,
                        gender,
                        email,
                        phone,
                        address,
                        bank_name,
                        account_number,
                        roleId: role,
                        userRoleId: role,
                        password: bin2hashData(password, process.env.PASSWORD_HASH),
                    })


                } catch (error) {
                    logger.error(`error during signup:, payload: ${JSON.stringify(req.body)}`)
                    logger.error(error)

                    response = new Response(failedStatus, "One or more body parameters are invalid", failureCode, {})
                    return res.status(400)
                        .send(response)

                }

                let mailFn = new SendMail()
                // generate a six digit otp
                let otp = Math.floor(100000 + Math.random() * 900000)
                try {
                    // generate the otp and send to customer
                    let currentDate = new Date()
                    let expiryDate = addMinutes(currentDate, 10)
                    let newOtpColumn = await Models.otp.create({
                        otp: otp,
                        validated: false,
                        userId: newUSer.id,
                        createdAt: currentDate,
                        updatedAt: currentDate,
                        expiry: expiryDate,
                        otp_for: "signup"
                    })

                    mailFn.dispatch(email, process.env.EMAIL, 'Confirm Registration', `Otp is ${otp}`, (err) => {
                        if (err) {
                            logger.error(`error during signup: , payload: ${JSON.stringify(req.body)}`)
                            logger.error(err)

                        }
                        response = new Response(successStatus, "Success, validate otp", successCode, { userId: newUSer.id })
                        return res.status(200).json(response)
                    })

                } catch (error) {
                    logger.error(`error during signup: , payload: ${JSON.stringify(req.body)}`)
                    logger.error(error)
                    response = new Response(failedStatus, "One or more body parameters are invalid", failureCode, {})
                    return res.status(400)
                        .send(response)
                }
            }
        })

    }),

    resendOtp: ('/', async (req, res) => {
        let {
            email
        } = req.body
        let response
        try {

            let user = await Models.user.findOne({
                where: {
                    email: email
                }
            })

            if (user == null || user == undefined) {
                response = new Response(failedStatus, "User not found", failureCode, {})
                return res.status(404)
                    .send(response)
            }

            if (user.is_verified) {
                response = new Response(failedStatus, "User already verified", failureCode, {})
                return res.status(400)
                    .send(response)

            }
            let oldOtp = await Models.otp.findOne({
                where: {
                    userId: user.id,
                    otp_for: "signup"
                }
            })

            if (oldOtp == null || oldOtp == undefined) {
                response = new Response(failedStatus, "Otp Not found", failureCode, {})
                return res.status(404)
                    .send(response)
            }

            let mailFn = new SendMail()
            let otp = Math.floor(100000 + Math.random() * 900000)

            // generate the otp and send to customer
            let currentDate = new Date()
            let expiryDate = addMinutes(currentDate, 10)
            await oldOtp.update({
                otp: otp,
                expiry: expiryDate
            })

            mailFn.dispatch(user.email, process.env.EMAIL, 'OTP', `Otp is ${otp}`, (err) => {
                if (err) {
                    logger.error(`error during resend otp, payload: ${JSON.stringify(req.body)}`)
                    logger.error(err)
                }
                response = new Response(successStatus, "Success, validate otp", successCode, { userId: user.id })
                return res.status(200).json(response)
            })


        } catch (error) {
            logger.error(`error during resend otp, payload: ${JSON.stringify(req.body)}`)
            logger.error(error)
            response = new Response(failedStatus, "An error occured", failureCode, {})
            return res.status(400)
                .send(response)

        }
    }),

    verifyOtp: ('/', async (req, res) => {
        let { id } = req.params
        let { otp } = req.body

        try {

            let foundUser = await Models.user.findOne({
                where: {
                    id: id
                }
            })


            if (foundUser == null || foundUser == undefined) {

                response = new Response(failedStatus, "USer Not found", failureCode, {})
                return res.status(404)
                    .send(response)
            }
            let foundOtp

            foundOtp = await Models.otp.findOne({
                where: {
                    userId: id,
                    otp,
                    otp_for: "signup"
                }
            })
            if (otp == "000000" && process.env.NODE_ENV == "test") {
                foundOtp = await Models.otp.findOne({
                    where: {
                        userId: id,
                        otp_for: "signup"
                    }
                })
                await foundOtp.update({
                    validated: true
                })

                await foundUser.update({
                    is_verified: true
                })


                response = new Response(successStatus, successStatus, successCode, {})
                return res.status(200).json(response)

            }
            if (foundOtp == null || foundOtp == undefined) {

                response = new Response(failedStatus, "Otp Not found", failureCode, {})
                return res.status(404)
                    .send(response)
            }

            if (foundOtp.validated) {

                response = new Response(failedStatus, "Otp already validated", failureCode, {})
                return res.status(400)
                    .send(response)
            }

            if (moment.tz("Africa/Lagos").unix() > moment.tz(foundOtp.dataValues.expiry, "Africa/Lagos").unix()) {

                response = new Response(failedStatus, "Otp Expired", failureCode, {})
                return res.status(404)
                    .send(response)
            }

            await foundOtp.update({
                validated: true
            })

            await foundUser.update({
                is_verified: true
            })


            response = new Response(successStatus, successStatus, successCode, {})
            return res.status(200).json(response)
        } catch (error) {
            logger.error(`error during validating otp, payload: ${JSON.stringify(req.body)}`)
            logger.error(error)
            response = new Response(failedStatus, "An error occured", failureCode, {})
            return res.status(400)
                .send(response)

        }
    }),

    getVerify: ('/', async (req, res) => {
        let response
        let { id } = req.params
        try {
            let foundUser = await User.findOne({
                where: {
                    id: id
                }
            })

            if (foundUser == null) {
                response = new Response(failedStatus, "User Not Found", failureCode, {})
                return res.status(404).send(response)
            }

            if (foundUser.is_verified) {
                response = new Response(failedStatus, "User Already Verified", failureCode, {})
                return res.status(400).send(response)

            }
            await foundUser.update({
                is_verified: true
            })


            response = new Response(successStatus, successStatus, successCode, successStatus)
            return res.status(200).send(response)
        } catch (error) {
            response = new Response(failedStatus, "An error occured", failureCode, error)
            return res.status(400).send(response)

        }
    }),

    getResetToken: ('/', async (req, res) => {
        let { token } = req.params
        try {
            let user = await Models.user.findOne({
                where: {
                    reset_password_token: token
                }
            })
            if (user == null || user == undefined) {
                response = new Response(failedStatus, "Invalid token", failureCode, {})
                return res.status(400).json(response)
            } else if (moment.tz("Africa/Lagos").unix() > moment.tz(user.dataValues.reset_password_expiry, "Africa/Lagos").unix()) {
                await user.update({
                    reset_password_token: null,
                    reset_password_expiry: null
                })
                response = new Response(failedStatus, "Token Expired", failureCode, {})
                return res.status(400).json(response)
            } else {
                response = new Response(successStatus, successStatus, successCode, {})
                return res.status(200).json(response)
            }
        } catch (error) {
            logger.error(error.toString())
            response = new Response(failedStatus, error.toString(), failureCode, {})
            return res.status(400).json(response)
        }
    }),
    postPasswordReset: ('/', (req, res) => {
        let { email } = req.body
        let response
        let dateTime = moment.tz(Date.now(), "Africa/Lagos").format().slice(0, 19).replace('T', ' ')
        isBodyEmpty(req.body).then(async (resp) => {
            try {
                let user = await Models.user.findOne({
                    where: {
                        email: email
                    }
                })

                if (user == null || user == undefined) {
                    response = new Response(failedStatus, "User does not Exist", failureCode, {})
                    return res.status(404).json(response)
                }
                let resetToken = crypto.randomBytes(20).toString('hex')
                let currentDate = new Date(dateTime)
                let expiryDate = addMinutes(currentDate, 30)


                let mailSend = new SendMail()
                mailSend.dispatch(email, process.env.EMAIL, "Reset Password", "You are recieving this because you have requested a password reset \n\n" +
                    "Please click on the following link, or paste into your browser to complete the process \n\n" +
                    "" + process.env.FRONTEND_URI + "/forgot/" + resetToken + "\n\n" +
                    "If you did not request this, please ignore and your password would remain unchanged", async (err) => {
                        if (err) {
                            logger.error(err)
                            response = new Response(failedStatus, "An error occured while sending mail", failureCode, {})
                            return res.status(400).json(response)
                        }
                        await user.update({
                            reset_password_token: resetToken,
                            reset_password_expiry: expiryDate
                        })
                        response = new Response(successStatus, "An Email has been sent with instructions", successCode, {})
                        return res.status(200).json(response)
                    })
            } catch (error) {
                logger.error(error.toString())
                response = new Response(failedStatus, error.toString(), failureCode, {})
                return res.status(400).json(response)
            }
        }).catch((err) => {
            let response = new Response(failedStatus, "Validation Error, one or more parameters are invalid", failureCode, {})
            return res.status(400).send(response)
        })

    }),


    postReset: ('/', async (req, res) => {
        isBodyEmpty(req.body).then(async (resp) => {
            let { token } = req.params
            let { password } = req.body
            try {
                let user = await Models.user.findOne({
                    where: {
                        reset_password_token: token
                    }
                })
                if (user == null || user == undefined) {
                    response = new Response(failedStatus, "Invalid token", failureCode, {})
                    return res.status(400).json(response)
                } else if (moment.tz("Africa/Lagos").unix() > moment.tz(user.dataValues.reset_password_expiry, "Africa/Lagos").unix()) {
                    await user.update({
                        reset_password_token: null,
                        reset_password_expiry: null
                    })
                    response = new Response(failedStatus, "Token Expired", failureCode, {})
                    return res.status(400).json(response)
                } else {
                    await user.update({
                        password: bin2hashData(password, process.env.PASSWORD_HASH),
                        reset_password_token: null,
                        reset_password_expiry: null
                    })
                    response = new Response(successStatus, successStatus, successCode, {})
                    return res.status(200).json(response)
                }
            } catch (error) {
                logger.error(error.toString())
                response = new Response(failedStatus, error.toString(), failureCode, {})
                return res.status(400).json(response)
            }
        }).catch((err) => {
            let response = new Response(failedStatus, "Validation Error, one or more parameters are invalid", failureCode, {})
            return res.status(400).send(response)
        })
    })
}

