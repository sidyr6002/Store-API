const mongoose = require(`mongoose`);

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Product name must be provided"]
    },
    price: {
        type: Number,
        min: [3, "must be atleast $3"],
        require: [true, "Product price must be provided"],
    },
    featured: {
        type: Boolean,
        default: false,
    },
    rating: {
        type: Number,
        default: 4.5,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    company: {
        type: String,
        enum: {
            values: ["ikea", "liddy", "caressa", "marcos"],
            message: "{VALUE} is not supported",
        },
    },
});

productSchema.index({ name : "text"})

module.exports = mongoose.model("Product", productSchema);;
