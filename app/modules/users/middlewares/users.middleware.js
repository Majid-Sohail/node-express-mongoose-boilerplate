/**
 * Created by Majid Sohail Khan
 */

const winston = require('winston'),
    _ = require('lodash');

let validationResponse = (message, req, next) => {
    return req.getValidationResult().then((result) => {
        if ( !result.isEmpty() ) {
            let errors = result.array().map((error) => {
                return error.message;
            });
            winston.error(message + errors.join(' && '));
            return next({ errorCode: errors[ 0 ] });
        } else {
            return next();
        }
    });
};

let signUpValidate = (req, res, next) => {
    req.assert('name', 1000).notEmpty();
    req.assert('name', 1001).isValidName();
    req.assert('email', 1002).notEmpty();
    req.assert('email', 1003).isValidEmail();
    req.assert('password', 1004).notEmpty();
    req.assert('password', 1005).isPasswordValid();

    validationResponse('*************** SignUp Validation ***************', req, next);
};

let loginValidate = (req, res, next) => {
    req.assert('email', 1002).notEmpty();
    req.assert('email', 1003).isValidEmail();
    req.assert('password', 1004).notEmpty();
    req.assert('password', 1005).isPasswordValid();

    validationResponse('*************** SignUp Validation ***************', req, next);
};


module.exports = {
    signUpValidate,
    loginValidate
};
