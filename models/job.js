const mongoose = require('mongoose');
const _ = require('lodash');

const jobSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        maxlength: 50
    },
    description: {
        type: String,
        maxlength: 256
    }
}, {
    timestamps: true,
    toJSON: {
        transform: doc => {
            return _.pick(doc, ['_id', 'title', 'description', 'createdAt', 'updatedAt']);
        }
    },
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;