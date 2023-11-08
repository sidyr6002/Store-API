const mongoose = require("mongoose");

const connectionURL = process.env.MONGODB_URL;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
};

const connectDB = () => {
    return mongoose.connect(connectionURL, options);
};

module.exports = connectDB;
