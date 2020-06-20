const Level = require('../models/level');
const express = require('express');
const router = express.Router();
const authenticationMiddleware = require('../middlewares/authentication');

router.get('/', authenticationMiddleware, async (req, res, next) => {
    const levels = await Level.find();
    res.json(levels);
});

router.get('/:id', authenticationMiddleware, async (req, res, next) => {
    const level = await Level.findById(req.params.id).populate({
        path: 'course',
        select: '_id title duration payment levelId'
    });
    res.json(level);
});

router.post('/', authenticationMiddleware, async (req, res, next) => {
    const level = new Level (req.body);

    await level.save();
    res.json(level);
});

module.exports = router;