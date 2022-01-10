const mongoose = require('mongoose');
const validator  = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env.config');

const userSchema = mongoose.Schema(
    {
        username: { type: String, required: true, trim: true },
        password: { type: String, required: true, minLength: 8 },
        hashpw: { type: String },
        createAt: { type: Date, default: Date.now },
        updateAt: { type: Date, default: Date.now },
        // deleteAt: { type: Date, default: Date.now },
        // action: { type: String, default: 'System' },
        isDelete: { type: Boolean, default: false},
        tokens: [{ token:{ type: String, required: true }}],
    },
    { timestamps: true }
);

userSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

userSchema.pre('save', async function(next) {
    // hash the pw before saving the user models
    const user = this
    if (user.isModified('password')) {
        user.hashpw = await bcrypt.hash(user.password, 8)
    }
    next()
})
userSchema.methods.generateAuthToken = async function () {
    // Generate an auth token for the user
    const user = this
    const token = jwt.sign({ _id: user._id }, env.jwt_key)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (username, password) => {
    // Search for a user by username and password.
    const user = await User.findOne({ username })
    if (!user) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.hashpw)
    if (!isPasswordMatch) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    return user
}

const User = mongoose.model("user", userSchema);
module.exports = User;