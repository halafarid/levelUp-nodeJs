const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const CustomError = require('../helpers/customError');

const util = require('util');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_KEY_SECRET;
const sign = util.promisify(jwt.sign);
const verify = util.promisify(jwt.verify);

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
    job: {
        title: {
            type: String,
            maxlength: 50
        },
        description: {
            type: String,
            maxlength: 256
        }
    },
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    enrolledCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
}, {
    timestamps: true,
    toJSON: {
        transform: doc => {
            return _.pick(doc, ['_id', 'fullName', 'email', 'userType', 'following', 'job', 'wishlist', 'ownFreeCourses', 'ownPaidCourses', 'enrolledCourses']);
        }
    },
});

userSchema.virtual('ownFreeCourses', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'instructorId'
});

userSchema.virtual('ownPaidCourses', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'instructorId'
});

sign({userId: ''}, jwtSecret)
    .then( token => console.log(token) )
    .catch( err => next() );

// To Encrypt the password
userSchema.pre('save', async function() {
    if (this.isModified('password'))
        this.password = await bcrypt.hash(this.password, 7)
});

// To Check the password is correct!
userSchema.methods.comparePassword = function(pass) {
    return bcrypt.compare(pass, this.password);
};

userSchema.methods.compareEmail = async function(em) {
    return await User.find( { email: em });
}

userSchema.methods.generateToken = function() {
    return sign({userId: this.id}, jwtSecret)
};

userSchema.statics.getCurrentUser = async function(token) {
    const payload = await verify(token, jwtSecret);
    const currentUser = await User.findById(payload.userId);

    if (!currentUser) throw CustomError(404, 'User Not Found!');
    return currentUser;
}

const User = mongoose.model('User', userSchema);

module.exports = User;