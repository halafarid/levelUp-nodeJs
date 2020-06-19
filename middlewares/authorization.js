const CustomError = require('../helpers/customError');

module.exports = async (req, res, next) => {
    const { id: userId } = req.params;
    if (req.user._id != userId ) throw CustomError(401, "You have no permission");
    next();
}