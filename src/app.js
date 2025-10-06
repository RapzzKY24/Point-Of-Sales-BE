require("./config/env");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRouter = require("./modules/auth/auth.router");
const categoryRouter = require("./modules/categories/category.router");
const productRouter = require("./modules/products/product.router");
const orderRouter = require("./modules/orders/order.router");
const reportRouter = require("./modules/reports/report.router");

const app = express();
app.use("/uploads", express.static("uploads"));
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/reports", reportRouter);

module.exports = app;
