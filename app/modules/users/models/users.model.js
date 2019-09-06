/**
 * Created by Majid Sohail Khan
 */
'use strict';

const mongoose = require('mongoose'),
    mongoose_timestamps = require('mongoose-timestamp'),
    schema = mongoose.Schema,
    bcrypt = require('bcryptjs');

let users = new schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    sessionId: { type: String, default: '' }
});

users.plugin(mongoose_timestamps);
users.index({ email: 1 }, { background: true, name: 'IDX_USER_EMAIL' });

users.pre('save', function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

users.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('users', users);