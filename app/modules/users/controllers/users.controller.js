/**
 * Created by Majid Sohail Khan
 */

const _ = require('lodash'),
    passport = require('passport'),
	mongoose = require('mongoose'),
    usersHelper = require('./helpers/users.helper'),
    _users = mongoose.model('users');

let signUp = async (req, res, next) => {
    try {
        const name = _.trim(req.body.name),
            email = _.trim(req.body.email.toLowerCase()),
            password = _.trim(req.body.password);

        let newUser = {
            name: name,
            email: email,
            password: password
        };
        let userCreated = await new _users(newUser).save();

        if (userCreated) {
            req.logIn(userCreated, (err) => {
                if (err) {
                    return next({ errorCode: 1006 });
                }
                req.user = userCreated;
                return next();
            });
        } else {
            return next({ errorCode: 1007 });
        }
    } catch (err) {
        return next({ errorCode: 1008 });
    }
};

let accountResponse = async (req, res, next) => {
    res.json({
        message: 'User account response.',
        data: usersHelper.generateAccountResponse(req.user)
    });
};

let login = async (req, res, next) => {
    passport.authenticate('user', (err, user, info) => {
        if ( err ) {
            return next({ errorCode: info.errorCode || 1006 });
        }
        if ( !user ) {
            return next({ errorCode: info.errorCode || '0002' });
        }
        req.logIn(user, (err) => {
            if ( err ) {
                return next({ errorCode: 1006 });
            }
            req.user = user;
            return next();
        });
    })(req, res, next);
};

let logout = async (req, res, next) => {
    try {
        await req.session.destroy(err => {
            if (err) { return next({ errorCode: 1012 }); }
            req.logout();
        });

        await _users.update({ _id: req.user._id }, { $set: { sessionId: '' }}).exec();

        res.json({
            message: 'User logged out successfully.',
            data: {}
        });
    } catch (err) {

    }
};

module.exports = {
    signUp,
    accountResponse,
    login,
    logout
};