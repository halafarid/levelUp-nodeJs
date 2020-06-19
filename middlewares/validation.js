const { validationResult } = require('express-validator');
const CustomError = require('../helpers/customError');

module.exports = (...checkValidations) => async (req, res, next) => {
    const promises = checkValidations.map(check => check.run(req));
    await Promise.all(promises);

    const { errors } = validationResult(req);

    if (errors.length > 0)
        throw CustomError(422, 'Validation Error', errors);
    else
        return next();
}