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
    check('userType').contains('instructor' || 'user')
];

router.get('/', async (req, res, next) => {
    const users = await User.find().populate('job');
    res.json(users);
});

router.patch('/:id', authenticationMiddleware, authorizationMiddleware, async (req, res, next) => {
    const { id } = req.params;

    const { fullName, email, password } = req.body;
    const user = await User.findByIdAndUpdate(id,
        { fullName, email, password },
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
    res.json(user);
});

router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) throw CustomError(404, 'Sorry, Email or Password is incorrect!');

    // const match = await user.comparePassword(password);
    // if (!match) throw CustomError(404, 'Sorry, Email or Password is incorrect!');

    const token = await user.generateToken();
    res.json({ user, token });
});

router.get('/profile/:id', authenticationMiddleware, async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id).populate('job');
    res.send(user);
});

router.get('/profile', authenticationMiddleware, async (req, res, next) => {
    const currentUser = await User.findById(req.user._id).populate('job');
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
    const myFollowing = await User.findById(req.user._id);
    res.send(myFollowing.following);
});

router.get('/followers', authenticationMiddleware, async (req, res, next) => {
    const myFollowers = await User.find({following: req.user._id});
    res.send(myFollowers);
});

module.exports = router;