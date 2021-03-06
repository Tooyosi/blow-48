const expressJwt = require('express-jwt');
const authenticate = expressJwt({ secret: process.env.SESSION_SECRET, algorithms: ['sha1', 'RS256', 'HS256'], });
const BaseResponse = require('../helpers/ResponseClass')
const { logger } = require('../loggers/logger')
const { failureCode, failedStatus, addMinutes, convertDate, dateTime } = require('../helpers/index')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const moment = require('moment-timezone')


module.exports = {
    protected: async (err, req, res, next) => {
        if (err.name === 'UnauthorizedError') {
            let response = new BaseResponse(failedStatus, err.message? err.message.toString() : 'Invalid Token', failureCode, {})
            res.status(401).send(response);
        } else {

            // next()
        }
    },

    isAdmin: async (req, res, next) => {
        if(!req.user.isManagement){
            let response = new BaseResponse(false, 'Invalid Operation, You need to be an Management admin to perform this operation', failureCode, {})
            res.status(401).send(response);
        }else{
            next()
        }
    },
    isAffiliate: async (req, res, next) => {
        if(req.user.isAffiliate || req.user.isAdmin){
            next()
        }else{
            let response = new BaseResponse(false, 'Invalid Operation, You need to be an affiliate member to perform this operation', failureCode, {})
            res.status(401).send(response);
        }
    },
    refresh: async (req, res, next) => {
        try {
            let sessionUser = await models.User.findOne({
                where: {
                    user_id: req.user.id
                }
            })
            let { dataValues } = sessionUser
            let expirtDate = moment.tz(dataValues.token_expiry_date, "Africa/Lagos").format().slice(0, 19).replace('T', ' ')
            let nowDate = new Date()
            let now = moment.tz("Africa/Lagos").unix()
            let dateExpired = new Date(moment.tz(dataValues.token_expiry_date, "Africa/Lagos").format().slice(0, 19).replace('T', ' ')).getTime();
            let {authorization} = req.headers
            let incomingToken = authorization.replace('Bearer ', '')
            // console.log(incomingToken == sessionUser.access_token)
            // console.log(moment.tz("Africa/Lagos").unix() > (moment.tz(dataValues.token_expiry_date, "Africa/Lagos").unix()))
            // console.log(moment.tz("Africa/Lagos").unix())
            // console.log(moment.tz(dataValues.token_expiry_date, "Africa/Lagos").unix())
            if(dataValues.token_expiry_date == null || sessionUser.access_token == null){
                let response = new BaseResponse(false, 'Invalid Token', failureCode, {})
                return res.status(403).send(response);
            }
            if(incomingToken !== sessionUser.access_token){
                let response = new BaseResponse(false, 'Invalid Token', failureCode, {})
                return res.status(403).send(response);
            }else if (moment.tz("Africa/Lagos").unix() > moment.tz(dataValues.token_expiry_date, "Africa/Lagos").unix()) {
                let response = new BaseResponse(false, 'Invalid Token', failureCode, {})
                return res.status(401).send(response);
            } else {
                next()
            }
        } catch (error) {
            logger.error(error.toString())
            response = new BaseResponse(false, error.toString(), failureCode, {})
            return res.status(400).json(response)

        }
    },

    isLoggedUser: async(req, res, next)=>{
        let {id} = req.params
        if(req.user.id != id){
            response = new BaseResponse(failedStatus, "Invalid User", failureCode, {})
            return res.status(400)
                .send(response)
        }
        next()
    },

    isUserOrAdmin: async(req, res, next)=>{
        let {id} = req.params
        if(req.user.id != id && !req.user.isAdmin){
            response = new BaseResponse(failedStatus, "Invalid User", failureCode, {})
            return res.status(400)
                .send(response)
        }
        next()
    },

    authenticate: authenticate
}