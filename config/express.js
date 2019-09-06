const express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    flash = require('connect-flash'),
    expressValidator = require('express-validator'),
    _ = require('lodash'),
    mongoStore = require('connect-mongo')(session),
    http = require('http'),
    chalk = require('chalk'),
    winston = require('winston'),
    customValidators = require('./customValidators');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../app/views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        return {
            param: param,
            message: msg,
            value: value
        };
    },
    customValidators: customValidators
}));

require('./config')(err => {
    if (err) {
        winston.error(err);
    } else {
        // Normalize a port into a number, string, or false.
        function normalizePort(val) {
            var port = parseInt(val, 10);

            if (isNaN(port)) {
                // named pipe
                return val;
            }

            if (port >= 0) {
                // port number
                return port;
            }

            return false;
        }

        /**
         * Event listener for HTTP server "error" event.
         */

        function onError(error) {
            if (error.syscall !== 'listen') {
                throw error;
            }

            var bind = typeof port === 'string'
                ? 'Pipe ' + port
                : 'Port ' + port;

            // handle specific listen errors with friendly messages
            switch (error.code) {
                case 'EACCES':
                    console.error(bind + ' requires elevated privileges');
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    console.error(bind + ' is already in use');
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        }

        /**
         * Event listener for HTTP server "listening" event.
         */

        function onListening() {
            var addr = server.address();
            var bind = typeof addr === 'string'
                ? 'pipe ' + addr
                : 'port ' + addr.port;
            console.log(chalk.bold.green('Server is listening on', bind));
        }

        // Create HTTP server.
        var server = http.createServer(app);

        /**
         * Get port from environment and store in Express.
         */
        var port = normalizePort(process.env.PORT || config.PORT);

        server.listen(process.env.PORT || config.PORT);
        server.on('error', onError);
        server.on('listening', onListening);

        var origin = '*';

        // CORS middleware
        const allowCrossDomain = function (req, res, next) {
            var allowedOrigins = [
                'http://localhost:4200'
            ];
            origin = req.headers.origin;

            if (allowedOrigins.indexOf(origin) > -1) {
                origin = req.headers.origin
            } else {
                origin = '*';
            }

            res.header('Access-Control-Allow-Origin', origin);
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Access-Control-Allow-Headers');
            res.header('Access-Control-Allow-Credentials', true);
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            next();
        };
        app.use(allowCrossDomain);
        app.use((req, res, next) => {

            if (req.method === 'OPTIONS') {
                console.log('!OPTIONS');
                var headers = {};
                headers["Access-Control-Allow-Origin"] = origin;
                headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE";
                headers["Access-Control-Allow-Credentials"] = true;
                headers["Access-Control-Allow-Headers"] = "Content-Type, X-Requested-With, Access-Control-Allow-Headers";
                headers["Cache-Control"] = "private, no-cache, no-store, must-revalidate";
                res.writeHead(200, headers);
                res.end();
            } else {
                return next();
            }
        });
        app.use(function(req, res, next){
            res.locals.NODE_ENV = process.env.NODE_ENV || 'development';
            next();
        });
        app.use(cookieParser());
        app.use(express.static(path.join(__dirname, '../public')));
        app.use(session({
            secret: config.session.secret,
            store: new mongoStore(
                {url: config.mongodb.host + config.mongodb.db_name, ttl: 14 * 24 * 60 * 60, clear_interval: 3600}
            ),
            resave: true,
            saveUninitialized: true,
            cookie: {
                maxAge: 100 * 24 * 3600 * 1000,
                httpOnly: true,
            }
        }));
        app.use(flash());

        var passport = require('./passport');
        app.use(passport.initialize());
        app.use(passport.session());

        const errors = require('./errors');
        require('./routes')(app);

        // catch 404 and forward to error handler
        app.use((req, res, next) => {
            let err = new Error();
            err.status = 404;
            next(err);
        });

        // error handlers
        app.use((err, req, res, next) => {
            if (err.errorCode) {
                winston.error(errors[ err.errorCode ].msg.EN);
                res.status(400);
            } else {
                winston.error(err.message);
                res.status(500);
                err.errorCode = '0007';
            }

            if ( err.status === 404 ) {
                err.errorCode = '0006';
            }

            if ( err.errorCode === '0003' ) {
                res.status(401);
            } else if ( err.errorCode === '0004' ) {
                res.status(403);
            }

            res.json({
                message: errors[ err.errorCode ].msg.EN,
                data: {}
            });
        });

        require('./scheduler'); // for cron jobs
    }
});

module.exports = app;
