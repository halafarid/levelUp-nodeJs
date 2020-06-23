const mongoose = require('mongoose');
const _ = require('lodash');

const levelSchema = new mongoose.Schema({
    title: {
        type: String,
        maxlength: 50,
        required: true
    }
}, {
    timestamps: true,
    toJSON: {
        transform: doc => {
            return _.pick(doc, ['_id', 'title', 'courses']);
        }
    },
});

levelSchema.virtual('courses', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'levelId'
});

const Level = mongoose.model('Level', levelSchema);

module.exports = Level;