require("dotenv").config();

const connectDB = require(`./db/connect`);
const Product = require(`./models/product`);

const jsonProducts = require(`./products.json`);

const start = async () => {
    try {
        await connectDB();
        await Product.deleteMany();
        await Product.create(jsonProducts);
        console.log("Connected to Database and populated successfully");
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

start();
