const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    userType: {
        type: String,
        required: true
    },
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    }]
}, {
    timestamps: true,
    toJSON: {
        transform: doc => {
            return _.pick(doc, ['_id', 'fullName', 'email', 'userType', 'following', 'job']);
        }
    },
});

userSchema.virtual('job', {
    ref: 'Job',
    localField: '_id',
    foreignField: 'userId'
});

const User = mongoose.model('User', userSchema);

module.exports = User;