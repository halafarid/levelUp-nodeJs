const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const CustomError = require('../helpers/customError');

const util = require('util');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_KEY_SECRET;
const sign = util.promisify(jwt.sign);
const verify = util.promisify(jwt.verify);

const courseSchema = new mongoose.Schema({
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
        ref: 'Category'
    }
}, {
    timestamps: true,
    toJSON: {
        transform: doc => {
            return _.pick(doc, ['_id', 'title', 'description', 'duration', 'categoryId' ]);
        }
    },
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;