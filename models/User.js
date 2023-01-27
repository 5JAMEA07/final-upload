const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema(
    {
        username: {type: String, required: [true, 'Username is required']},
        balance: { type: Number, min: 0, required: true },
        type_of_user: {type: String, default: 'customer'},
        password: { type: String, required: [true, 'password is required'] }
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    try {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
        next();
    } catch (e) {
        throw Error('Could not hash password');
    }
})

module.exports = mongoose.model("User", userSchema);