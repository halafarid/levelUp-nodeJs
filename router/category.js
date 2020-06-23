const Category = require('../models/category');
const Level = require('../models/level');
const express = require('express');
const router = express.Router();
const authenticationMiddleware = require('../middlewares/authentication');

router.get('/', authenticationMiddleware, async (req, res, next) => {
    const categories = await Category.find();
    res.json(categories);
});

router.get('/filters', 
    authenticationMiddleware,
    async (req, res, next) => {
        const q = req.query;
        console.log(q.catsId);
        
        if (q.catsId && q.levelsId) {
            const catsArr = q.catsId.split(',');
            const levelsArr = q.levelsId.split(',');
            
            const filters = await Category.find({ _id: { $in: catsArr }}).populate({
                path: 'courses',
                select: '_id title duration payment levelId materials',
                populate: {
                    path: 'levelId',
                    model: 'Level',
                    match: {_id: { $in: levelsArr} }
                }
            }).select('courses');
            
            const filteredBasedOnLevel = filters
                .reduce((acc, curr) => [...acc, ...curr.courses] , [])
                .filter(course => course.levelId !== null && levelsArr.includes(course.levelId._id.toString()));
            res.json(filteredBasedOnLevel);

        } else if (q.catsId) {
            const catsArr = q.catsId.split(',');

            const filters = await Category.find({ _id: { $in: catsArr }}).populate({
                path: 'courses',
                select: '_id title duration payment levelId materials',
                populate: {
                    path: 'levelId',
                    model: 'Level'
                }
            }).select('courses');
            res.json(filters);

        } else if (q.levelsId) {
            const levelsArr = q.levelsId.split(',');
            const filters = await Level.find({ _id: { $in: levelsArr }}).populate({
                path: 'courses',
                select: '_id title duration payment levelId materials',
                populate: {
                    path: 'levelId',
                    model: 'Level'
                }
            });
            res.json(filters);

        } else {
            const categories = await Category.find();
            res.json(categories);
        }
    }
);

router.post('/', authenticationMiddleware, async (req, res, next) => {
    const { title } = req.body;
    const category = new Category ({ title });

    await category.save();
    res.json(category);
});

router.patch('/:id', authenticationMiddleware, async (req, res, next) => {
    const { id } = req.params;
    const { title } = req.body;
    const category = await Category.findByIdAndUpdate(id,
        { title },
        { new: true, omitUndefined: true, runValidators: true }
    );
    res.json(category);
});

router.delete('/:id', authenticationMiddleware, async (req, res, next) => {
    const { id } = req.params;
    var category = await Category.findOneAndDelete(id);
    res.json(category);
});

module.exports = router;