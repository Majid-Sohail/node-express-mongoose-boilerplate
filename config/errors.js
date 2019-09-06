/**
 * Created by Majid on 09/12/2017.
 */
const glob = require('glob');
const _ = require('lodash');
const fs = require('fs'),
    winston = require('winston');

winston.info('error messages are loading ...');
let routePath = 'app/modules/**/*.errors.json';
// initialising with common error message objects
let errorObject = {
    '0001': {
        'msg': {
            'EN': 'Account with this email does not exist.',
        }
    },
    '0002': {
        'msg': {
            'EN': 'Incorrect password entered.',
        }
    },
    '0003': {
        'msg': {
            'EN': 'You are not authenticated.',
        }
    },
    '0004': {
        'msg': {
            'EN': 'You are not authorized to visit this api.',
        }
    },
    '0005': {
        'msg': {
            'EN': 'Your account is blocked. Contact admin@admin.com for further details.',
        }
    },
    '0006': {
        'msg': {
            'EN': 'Requested API doesn\'t exist.',
        }
    },
    '0007': {
        'msg': {
            'EN': 'Internal server error, please contact administrator.',
        }
    }
};

glob.sync(routePath).forEach(function (file) {
    _.extend(errorObject, JSON.parse(fs.readFileSync(file, 'utf-8')));
    winston.info(file + ' is loaded');
});

module.exports = errorObject;
