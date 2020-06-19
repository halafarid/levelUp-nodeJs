const mongoose = require('mongoose');
const _ = require('lodash');

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        maxlength: 50
    }
}, {
    timestamps: true,
    toJSON: {
        transform: doc => {
            return _.pick(doc, ['_id', 'title', 'course' ]);
        }
    },
});

categorySchema.virtual('course', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'categoryId'
});


const Category = mongoose.model('Category', categorySchema);

module.exports = Category;