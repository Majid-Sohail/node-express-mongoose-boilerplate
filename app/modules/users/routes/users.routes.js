/**
 * Created by Majid Sohail Khan
 */
const passport = require('../../../../config/passport'),
	usersMiddleWare = require('../middlewares/users.middleware'),
	commonLib = require('../../../libs/common/common.library'),
	usersHelper = require('../controllers/helpers/users.helper'),
    usersController = require('../controllers/users.controller');

module.exports = (app, version) => {
	let moduleName = '/users';

	app.post(
		version + moduleName + '/sign-up',
		usersMiddleWare.signUpValidate,
		usersHelper.isEmailExists,
		usersController.signUp,
		usersController.accountResponse
	);

    app.post(
        version + moduleName + '/login',
        usersMiddleWare.loginValidate,
        usersController.login,
        usersController.accountResponse
    );

    app.get(
        version + moduleName + '/logout',
        passport.isAuthenticated,
        usersController.logout
    );
};