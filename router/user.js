const User = require('../models/user');
const express = require('express');
const router = express.Router();
const CustomError = require('../helpers/customError');

const authenticationMiddleware = require('../middlewares/authentication');
const authorizationMiddleware = require('../middlewares/authorization');
const validationMiddleware = require('../middlewares/validation');
const { check } = require('express-validator');

let validations = [
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters!'),
    check('email').isEmail().withMessage('Ivalid email!'),
    check('userType').optional().isIn(['user','instructor'])
];

router.get('/', async (req, res, next) => {
    const users = await User.find().populate('ownCourses');
    res.json(users);
});

router.patch('/:id', authenticationMiddleware, authorizationMiddleware, async (req, res, next) => {
    const { id } = req.params;

    const { fullName, email, password, job } = req.body;
    const user = await User.findByIdAndUpdate(id,
        { fullName, email, password, job },
        { new: true, omitUndefined: true, runValidators: true }
    );
    res.json(user);
});

router.delete('/:id', authenticationMiddleware, authorizationMiddleware, async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findOneAndDelete(id);
    res.json(user);
});

router.post('/registeration', validationMiddleware(validations[0], validations[1], validations[2]), async (req, res, next) => {
    const { fullName, email, password, userType } = req.body;
    const user = new User({ fullName, email, password, userType });
    
    const matchEmail = await user.compareEmail(email);
    if (matchEmail.length > 0) throw CustomError(400, 'This email is already exists!');

    await user.save();
    const token = await user.generateToken();
    res.json({user,token});
});

router.post('/login', async (req, res, next) => {
    const { email, password ,userType } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw CustomError(404, 'Sorry, Email or Password is incorrect!');

    if(user.userType!==userType) throw CustomError(404, `Sorry, you are not a ${userType}`);

    const match = await user.comparePassword(password);
    if (!match) throw CustomError(404, 'Sorry, Email or Password is incorrect!');



    const token = await user.generateToken();
    res.json({ user, token });
});

router.get('/profile/:id', authenticationMiddleware, async (req, res, next) => {
    const user = await User.findById(req.params.id).populate({
        path: 'ownCourses',
        select: '_id title duration payment'
    });
    res.send(user);
});

router.get('/profile', authenticationMiddleware, async (req, res, next) => {
    const currentUser = await User.findById(req.user._id).populate({
        path: 'ownCourses',
        select: '_id title duration payment levelId'
    });
    res.send(currentUser);
});

// Follow & UnFollow
router.post('/:id/follows', authenticationMiddleware, async (req, res, next) => {
    const { id } = req.params;

    if (req.user._id.toString() !== id && !req.user.following.some(userID => userID.toString() === id))
        await User.updateOne( {_id: req.user._id},  { $push: { following: id } });
    else
        await User.updateOne( {_id: req.user._id},  { $pull: { following: id } });

    res.send(id);
});

router.get('/following', authenticationMiddleware, async (req, res, next) => {
    const myFollowing = await User.findById(req.user._id).populate('following');
    res.send(myFollowing.following);
});

router.get('/followers', authenticationMiddleware, async (req, res, next) => {
    const myFollowers = await User.find({following: req.user._id});
    res.send(myFollowers);
});

// Buy course
router.post('/payments/:cid', authenticationMiddleware, async (req, res, next) => {
    const { cid } = req.params;
    if (!req.user.enrolledCourses.some(userID => userID.toString() === cid))
        await User.updateOne( {_id: req.user._id}, { $push: { enrolledCourses: cid } });
    res.json('You enrolled in this course');
});

module.exports = router;