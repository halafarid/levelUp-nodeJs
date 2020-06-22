const mongoose = require('mongoose');
const _ = require('lodash');

const courseSchema = new mongoose.Schema({
    instructorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        maxlength: 256
    },
    duration: {
        type: Number,
        required: true
    },
    payment: {
        type: Number,
        required: true
    },
    features: {
        type: [String],
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    levelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Level',
        required: true
    },
    progress: {
        type: Number,
        default: 0
    },
    materials: [
        {
            title: {
                type: String,
                required: true,
                maxlength: 50
            },
            link: {
                type: String,
                required: true
            }
        }
    ],
    reviews: []
}, {
    timestamps: true,
    toJSON: {
        transform: doc => {
            return _.pick(doc, ['_id', 'title', 'description', 'duration', 'payment', 'users', 'features', 'progress', 'categoryId', 'levelId', 'materials', 'reviews', 'instructorId' ]);
        }
    },
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;