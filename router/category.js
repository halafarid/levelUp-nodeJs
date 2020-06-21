const Category = require('../models/category');
const express = require('express');
const router = express.Router();
const authenticationMiddleware = require('../middlewares/authentication');

router.get('/', authenticationMiddleware, async (req, res, next) => {
    const categories = await Category.find();
    res.json(categories);
});

router.get('/:id', authenticationMiddleware, async (req, res, next) => {
    const category = await Category.findById(req.params.id).populate({
        path: 'course',
        select: '_id title duration payment levelId'
    });
    res.json(category);
});

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