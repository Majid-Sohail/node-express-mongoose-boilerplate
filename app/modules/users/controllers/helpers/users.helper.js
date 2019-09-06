/**
 * Created by Majid Sohail Khan
 */

const randomize = require('randomatic'),
    mongoose = require('mongoose'),
    _ = require('lodash'),
    _users = mongoose.model('users');

let isEmailExists = async (req, res, next) => {
    try {
        const email = _.trim(req.body.email.toLowerCase());

        let emailFound = await _users.count({email: email});

        if (!emailFound) {
            return next();
        }
        return next({ errorCode: 1010 });
    } catch (err) {
        return next({ errorCode: 1011 });
    }
};

let generateAccountResponse = user => {
    return {
        _id: user._id,
        name: user.name,
        email: user.email
    };
};

module.exports = {
    isEmailExists,
    generateAccountResponse
};