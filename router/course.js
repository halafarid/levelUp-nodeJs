const Course = require('../models/course');
const express = require('express');
const router = express.Router();
const CustomError = require('../helpers/customError');
const authenticationMiddleware = require('../middlewares/authentication');
const authorizationMiddleware = require('../middlewares/authorization');
const validationMiddleware = require('../middlewares/validation');

router.get('/', async (req, res, next) => {
    const courses = await Course.find();
    res.json(courses);
});

router.post('/', async (req, res, next) => {
    const { title, description, duration } = req.body;
    const course = new Course({ title, description, duration });

    await course.save();
    res.json(course);
});

module.exports = router;