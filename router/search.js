const User = require('../models/user');
const Course = require('../models/course');
const express = require('express');
const router = express.Router();
const authenticationMiddleware = require('../middlewares/authentication');

// Search by instructor name
router.get('/instructors', authenticationMiddleware, async (req, res, next) => {
    const users = await User.find({ userType:'instructor' }).select('_id fullName job');
    res.json(users);
});

// Search by course name
router.get('/courses', authenticationMiddleware, async (req, res, next) => {
    const users = await Course.find().select('_id title');
    res.json(users);
});

// Search by course name
router.get('/jobs', authenticationMiddleware, async (req, res, next) => {
    const users = await User.find({ userType:'instructor', job: {$exists: true} }).select('_id fullName job');
    res.json(users);
});

// Global Search
router.get('/', authenticationMiddleware, async (req, res, next) => {
    const users = await User.find({ userType:'instructor' }).select('_id fullName job');
    const courses = await Course.find().select('_id title');

    res.json({users,courses});
});

module.exports = router;