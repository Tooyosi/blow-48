'use strict';
const passport = require('passport');
const Strategy = require('passport-local');
const {User, Role} = require('../models')
const {bin2hashData} = require('./index')

passport.use(new Strategy({
    // set the fields to be used for validation
    usernameField: 'email',
    passwordField: 'password'
},
    async (username, password, done) => {
        let userDetails = await User.findOne({
            attributes: {exclude: ['password', 'reset_password_token', 'reset_password_expiry']},
            where: {
                email: username,
                password: bin2hashData(password, process.env.PASSWORD_HASH)
            },
            include: {
                model: Role,
                as: 'Role',
                attributes: ['role']

            },
        })
        if (userDetails !== null && userDetails !== undefined && userDetails.dataValues.is_verified == true) {
            let {dataValues} = userDetails
            done(null, dataValues)
        }else if(userDetails && userDetails.dataValues.is_verified == false) {
            done(null, false, "User not activated, Kindly activate your account");
        }else {
            done(null, false, "Invalid Credentials");
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    const users = user.id === id ? user : false
    done(null, users)
})

module.exports = passport;