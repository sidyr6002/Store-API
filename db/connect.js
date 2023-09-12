const mongoose = require('mongoose')

const connectionURL = process.env.MONGODB_URL

const connectDB = () => {
  return mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}

module.exports = connectDB
