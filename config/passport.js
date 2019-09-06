const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mongoose = require('mongoose'),
    _users = mongoose.model('users');

passport.use('user', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, (email, password, done) => {
        _users.findOne({ email: email.toLowerCase() }, (err, user) => {
            if ( err ) {
                return done(err);
            }
            if ( !user ) {
                return done(null, false, { errorCode: '0001' });
            }
            user.comparePassword(password, (err, isMatch) => {
                if ( err ) {
                    return done(err);
                }
                if ( !isMatch ) {
                    return done(null, false, { errorCode: '0002' });
                }
                return done(null, user);
            });
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((acct, done) => {
    _users.findById(acct._id, (err, user) => {
        if ( err || !user ) {
            done(err, null);
        } else {
            done(err, user);
        }
    });
});

// Passport Middleware
passport.isAuthenticated = (req, res, next) => {
    if ( req.isAuthenticated() ) {
        if (req.user.status === 3) { // If Feature Exists
            return next({ errorCode: '0005' });
        }
        return next();
    }
    return next({ errorCode: '0003' });
};

passport.isAuthorized = userType => {
    return (req, res, next) => {
        if ( req.user.role === 0 ) { // If Exists
            return next();
        } else {
            return next({ errorCode: '0004' });
        }
    };
};

passport.differentiateUserType = (req, res, next) => { // Remove this function at the end of Project
    return next();
};

module.exports = passport;
