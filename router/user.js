const User = require('../models/user');
const express = require('express');
const router = express.Router();
const CustomError = require('../helpers/customError');

router.get('/', async (req, res, next) => {
    const users = await User.find().populate('job');
    res.json(users);
});

router.post('/registeration', async (req, res, next) => {
    const { fullName, email, password, userType } = req.body;
    const user = new User({ fullName, email, password, userType });
    
    await user.save();
    res.json(user);
});

module.exports = router;