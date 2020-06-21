const Course = require('../models/course');
const User = require('../models/user');
const express = require('express');
const router = express.Router();
const CustomError = require('../helpers/customError');
const authenticationMiddleware = require('../middlewares/authentication');

router.get('/', 
    async (req, res, next) => {
        if (req.query.q) 
            return authenticationMiddleware;
        next();
    }, 
    async (req, res, next) => {
        const q = req.query;
        const pageNo = parseInt(q.pageNo);
        const size = parseInt(q.size);

        const courses = await Course.find().skip(size * (pageNo - 1)).limit(size).populate('categoryId').populate('levelId').populate({
            path: 'instructorId',
            select: '_id fullName'
        });
        res.json(courses);
    }
);

router.get('/free', 
    async (req, res, next) => {
        if (req.query.q) 
            return authenticationMiddleware;
        next();
    },
    async (req, res, next) => {
        const q = req.query;
        const pageNo = parseInt(q.pageNo);
        const size = parseInt(q.size);
        const courses = await Course.find({ payment: 0 }).skip(size * (pageNo - 1)).limit(size).select('_id title duration payment users').populate('categoryId').populate('levelId');
        res.json(courses);
    }
);

router.get('/paid', 
    async (req, res, next) => {
        if (req.query.q) 
            return authenticationMiddleware;
        next();
    },
    async (req, res, next) => {
        const q = req.query;
        const pageNo = parseInt(q.pageNo);
        const size = parseInt(q.size);
        const courses = await Course.find({ payment: { $gt: 0 } }).skip(size * (pageNo - 1)).limit(size).select('_id title duration payment').populate('categoryId').populate('levelId');
        res.json(courses);
    }
);

router.get('/:id', authenticationMiddleware, async (req, res, next) => {
    const { id } = req.params;
    const course = await Course.findById(id).populate('categoryId').populate('levelId').populate({
        path: 'instructorId',
        select: '_id fullName'
    });
    res.json(course);
});

router.post('/', authenticationMiddleware, async (req, res, next) => {
    const course = new Course(req.body);
    await course.save();
    res.json(course);
});

router.patch('/:id', authenticationMiddleware, async (req, res, next) => {
    const { id } = req.params;

    const { title, description, duration, payment, features, categoryId, levelId, materials } = req.body;
    const course = await Course.findByIdAndUpdate(id,
        { title, description, duration, payment, features, categoryId, levelId, materials },
        { new: true, omitUndefined: true, runValidators: true }
    );
    res.json(course);
});

router.delete('/:id', authenticationMiddleware, async (req, res, next) => {
    const { id } = req.params;
    const isEnrolled = await User.find({ enrolledCourses: id });
    if (isEnrolled.length === 0)
        var course = await Course.findOneAndDelete(id);
    else
        throw CustomError(401, 'You can\'t delete this course because users is enrolled in');
    res.json(course);
});

router.get('/:id/reviews', authenticationMiddleware, async (req, res, next) => {
    const { id } = req.params;
    const course = await Course.findById(id);
    res.json(course.reviews);
});

router.post('/:id/reviews', authenticationMiddleware, async (req, res, next) => {
    const { id } = req.params;
    const { userId, title, rating} = req.body
    const course = await Course.findById(id);
    await Course.updateOne( {userId: req.user._id},  { $push: { reviews: { userId, title, rating} } });
    res.json(course);
});

module.exports = router;