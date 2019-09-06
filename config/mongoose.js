/**
 * Created by Majid on 09/12/2018.
 */

'use strict'; // NO SONAR

const mongoose = require('mongoose'),
    config = require('./config'),
    winston = require('winston'),
    path = require('path'), blueBird = require('bluebird');

let connect = callback => {

    let options = { useMongoClient: true, server: { socketOptions: { keepAlive: 1 } }, promiseLibrary: blueBird };

    let db = mongoose.connect(config.db, options, function (err) {
        // Log Error
        if ( err ) {
            winston.log('Error', 'Could not connect to MongoDB!');
            winston.error(err);
        } else {

            // Enabling mongoose debug mode if required
            mongoose.set('debug', config.enableMongoDebugging);

            winston.info('Connected to MongoDb');

            // Call callback FN
            if ( callback ) callback(db);
        }
    });
};

let loadModels = () => {
    winston.info('Loading Models');
    config.getGlobbedFiles(config.modelsDirMongo)
    // import model files and save model names
        .forEach(function (file) {
            winston.info('Loading mongoose model file ' + file);
            require(path.join(config.modelsDirMongo, file));
        });
};


module.exports = {
    connect,
    loadModels
};




