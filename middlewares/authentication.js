const User = require('../models/user');
const CustomError = require('../helpers/customError');

module.exports = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) throw CustomError(401, 'You must login first!');

    const currentUser = await User.getCurrentUser(token);
    req.user = currentUser;
    next();
}