const _ = require('lodash');

let customValidators = {
    isNumber: value => {
        return _.isNumber(value);
    },
    isArray: value => {
        return Array.isArray(value);
    },
    isNumArray: array => {
        let isNum = true;
        array.map(value => {
            if (!_.isNumber(value)) isNum = false;
        });
        return isNum;
    },
    isValidPercentage: value => {
        return (value >= 0 && value <= 100);
    },
    arrayElemNotDuplicated: array => {
        if (array && array.length > 1) {
            let values = _.filter(array, (value, index, iteratee) => {
                return _.includes(iteratee, value, index + 1);
            });

            if (values.length) return false;
            else return true;
        }
        else {
            return true;
        }
    },
    arrayIsNotEmpty: array => {
        if (array && array.length >= 1) {
            return true;
        } else {
            return false;
        }
    },
    isPasswordValid: value => {
        if (value === undefined || value.length < 8) {
            return false;
        }
        else {
            return true;
        }
    },
    // isPasswordValid: (value) => /^(?=.*\d).{8,}$/.test(value),
    isUserIdValid: value => {
        return /^(\+\d{1,3}[- ]?)?\d{10}$/.test(value) ||
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
    },
    isDeviceTypeValid: value => {
        return value == config.deviceTypes[0] || value == config.deviceTypes[1];
    },
    isUserTypeValid: value => {
        return value == config.userTypes[0] || value == config.userTypes[1];
    },
    isPhoneNumberValid: value => {
        let regex = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;

        return /^((\+92)|(0092)|(92))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/.test(value) || regex.test(value);
    },
    isLatLongValid: value => /^(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)$/.test(value),
    nonNegative: value => value >= 0,
    isValidDateAndTime: value => {
        return moment(value).isValid();
    },
    isValidDate: value => {
        return moment(value, 'DD-MM-YYYY').isValid();
    },
    isValidEmailOrPhone: value => {
        if (/^(\+\d{1,3}[- ]?)?\d{10}$/.test(value)) {
            return true;
        } else if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
            return true;
        } else {
            return false;
        }
    },
    isValidCurrentOrFutureDate: value => {
        let date = moment(value);
        let currentDate = moment().unix();
        return moment(date).isAfter(currentDate);
    },
    isValidEmail: value => {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
    },
    isValidObjectId: value => {
        let checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');

        if (checkForHexRegExp.test(value)) {
            return true;
        }
        else {
            return false;
        }
    },
    isValidDeviceType: value => {
        if (value === 'android' || value === 'ios' || value === 'web') {
            return true;
        }
        else {
            return false;
        }
    },
    isValidWhoWillValue: value => {
        value = parseInt(value);
        if (value === 1 || value === 2 || value === 3) {
            return true;
        }
        else {
            return false;
        }
    },
    isMessageContainsContent: value => {
        if (value.length > 0) {
            return true;
        }
        else {
            return false;
        }
    },
    isValidGenderType: value => {
        if ((config.genderTypes.indexOf(value) > -1)) {
            return true;
        } else {
            return false;
        }
    },
    isValidUrl: value => {
        if (value) {
            if (validUrl.isUri(value)) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    },
    validateAge: value => {
        if (value) {
            let dob = moment(value, 'DD-MM-YYYY');
            let years = moment().diff(dob, 'years');
            if (years >= 18) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    },
    isValidStateOfCanada: stateName => {
        let statesArr = country.states('CA'),
            stateFound = statesArr.find(state => (state.abbreviation === stateName));
        return stateFound;
    },
    isValidName: name => {
        let regex = /^[a-zA-Z ]{2,30}$/;
        if (regex.test(name)) {
            return true;
        }
        else {
            return false;
        }
    },
    isValidDistanceArea: value => {
        if (value) {
            if (value > -1 && value < 501) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    isValidImageIndex: value => {
        if (value && (value > -1 && value <= 5)) {
            return true;
        } else {
            return false;
        }
    },
    isValidTimePeriod: value => {
        if ((config.timePeriod.indexOf(value.toLowerCase()) > -1)) {
            return true;
        } else {
            return false;
        }
    },
    isValidSlotMinutes: minutes => {
        if (minutes === 0 || minutes === 15 || minutes === 30 || minutes === 45) {
            return true;
        } else {
            return false;
        }
    },
    isValidCurrentOrFutureUnixTimeStamp: value => {
        let date = moment.unix(value);
        let currentDate = moment();
        return moment(date).isAfter(currentDate);
    },
    isBoolean: function (value) {
        return _.isBoolean(value);
    },
    isValidContactType: contactType => {
        if ( config.contactTypes.indexOf(contactType) === -1 ) {
            return false;
        }
        return true;
    },
    isValidLicenseType: licenseType => {
        if ( config.accessTypes.indexOf(licenseType) === -1 ) {
            return false;
        }
        return true;
    }
};

module.exports = customValidators;