const mongoose = require("mongoose");
const { Schema } = mongoose;

const songSchema = new Schema(
    {
        title: {type: String, required: [true, 'Title is required']},
        artist: {type: String, required: [true, 'Artist is required']},
        no_of_sales: {type: Number, default: 0},
        quantity: {type: Number, required: [true, 'Title is required']},
        price: {type: Number, required: [true, 'Title is required']},
    },
    { timestamps: true }
);

module.exports = mongoose.model("Song", songSchema);