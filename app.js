require("dotenv").config();
const express = require("express");
const connectDB = require(`./db/connect`);
const routes = require(`./routes/products`)
const app = express();

// -------------------- MIDDLEWARE ---------------------------
app.use(express.json());
const invalidPathHandler = require(`./middleware/invalidPathMiddleware`);
const errorHandler = require(`./middleware/errorHandlerMiddleware`);
const e = require("express");

// ------------------ IP and PORT ----------------------------
const hostAdd = process.env.HOST_ADDRESS;
const port = process.env.PORT;

// ---------------------- API --------------------------------
app.get("/", (req, res) => {
    res.send(`<h1 style = "text-align:center"> Store API </h1>
              <div style = "text-align:center">
                <a href="/api/v1/products">Products</a>
              </div>`);
});

app.use("/api/v1/products/", routes);
app.use(invalidPathHandler);
app.use(errorHandler);

// ------------------ CONNECT TO DB --------------------------
const start = async () => {
    try {
        await connectDB();
        console.log("Successfully connected to the DB");

        app.listen(port, hostAdd, () => {
            console.log(`The server is listening on http://${hostAdd}:${port}`);
        });
    } catch (error) {
        console.error(error);
    }
};

start();
