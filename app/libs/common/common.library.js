/**
 * Created by Majid Sohail Khan
 */

const async = require('async'),
    bcrypt = require('bcryptjs'),
    moment = require('moment'),
    requestIp = require('request-ip'),
    mailer = require('../../../config/mailer'),
    passport = require('passport'),
    SALT_WORK_FACTOR = 10,
    _ = require('lodash');

let fetchIPAdress = (req, res, next) => {
    const clientIp = requestIp.getClientIp(req);
    req.clientIp = clientIp;
    next();
};

let formatDate = dateTime => {
    return moment.utc(dateTime).format('YYYY-MM-DD');
};

let getUTCDateTime = dateTime => {
    return moment.utc(dateTime, 'YYYY-M-D');
};

let formatDateOfBirth = dateTime => {
    return moment.utc(dateTime, 'DD-MM-YYYY');
};

let saltPassword = (password, cb) => {
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if ( err ) return cb(err);
        // hash the password using our new salt
        bcrypt.hash(password, salt, (err, hash) => {
            if ( err ) return cb(err);
            // override the cleartext password with the hashed one
            return cb(null, {
                salt: salt,
                password: hash
            });
        });
    });
};

let sendEmail = (email, body, vars, template) => {
    return new Promise((resolve, reject) => {
        mailer.sendEmailer(email, body, vars, template, err => {
            if ( err ) {
                return reject(err);
            } else {
                return resolve();
            }
        });
    });
};

let formatMultipleDates = (dateTime1, dateTime2, format) => {

    return moment.utc(dateTime1).format(format) + ' to ' + moment.utc(dateTime2).format(format);
};

let formatMultipleDatesWithMultipleFormats = (dateTime1, dateTime2, format1, format2) => {
    return moment.unix(dateTime1).format(format1) + ' to ' + moment.unix(dateTime2).format(format2);
};

let formatDateSingle = (dateTime1, format) => {
    return moment.utc(dateTime1).format(format);
};

if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function () {
        return this * Math.PI / 180;
    }
}

let findDistance = (start, end, decimals = 2, cb) => {

    let earthRadius = 6371, // km
        lat1, lat2, lon1, lon2;

    lat1 = parseFloat(start.lat);
    lat2 = parseFloat(end.lat);
    lon1 = parseFloat(start.long);
    lon2 = parseFloat(end.long);

    let dLat = (lat2 - lat1).toRad();
    let dLon = (lon2 - lon1).toRad();
    lat1 = lat1.toRad();
    lat2 = lat2.toRad();

    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = earthRadius * c;
    return cb(null, (Math.round(d * Math.pow(10, decimals)) / Math.pow(10, decimals)));
};

let authenticateAccount = (req, res, next, userType) => {
    passport.authenticate(userType, (err, acct, info) => {
        if (err) {
            return next(err);
        }
        if (!acct) {
            return next(info);
        }
        req.logIn(acct, (err) => {
            if (err) {
                return next(err);
            }
            req.acct = acct;
            next();
        });
    })(req, res, next);
};

let isValidObjectId =  value => {
    let checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');

    if ( checkForHexRegExp.test(value) ) {
        return true;
    }
    else {
        return false;
    }
};

let checkArrayElementNotDuplicate = array => {
    if ( array && array.length > 1 ) {
        let values = _.filter(array, (value, index, iteratee) => {
            return _.includes(iteratee, value, index + 1);
        });

        if ( values.length ) 
        	return false;
        else 
        	return true;
    }
    else {
        return true;
    }
};

module.exports = {
    fetchIPAdress,
    formatDate,
    getUTCDateTime,
    formatDateOfBirth,
    saltPassword,
    sendEmail,
    formatMultipleDates,
    formatDateSingle,
    findDistance,
    formatMultipleDatesWithMultipleFormats,
    authenticateAccount,
    isValidObjectId,
    checkArrayElementNotDuplicate
};