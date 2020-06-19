const Category = require('../models/category');
const express = require('express');
const router = express.Router();
const authenticationMiddleware = require('../middlewares/authentication');

router.get('/', async (req, res, next) => {
    const categories = await Category.find().populate('course');
    res.json(categories);
});

router.post('/', async (req, res, next) => {
    const { title } = req.body;
    const category = new Category ({ title });

    await category.save();
    res.json(category);
});

// router.patch('/:id', async (req, res, next) => {
//     const { id } = req.params;
//     const { courseId, title } = req.body;

//     const category = await Category.findByIdAndUpdate(id,
//         { courseId, title },
//         { new: true, omitUndefined: true, runValidators: true }
//     );
//     res.json(category);
// });

module.exports = router;