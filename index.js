const express = require("express");
const app = express();
const db = require("./db");
const cors = require("cors");
const bodyParser = require("body-parser");
const registration = require("./controllers/registrationController");
const userLogin = require("./controllers/loginController");
const createProducts = require("./controllers/productController");
const productPurchase = require('./controllers/productOrderController');

//cors
app.use(cors());
app.options("*", cors());

app.use(bodyParser.json());

//Routers http://localhost:3001/api/v1/userRegistration/registerUsers
app.use("/api/v1/userRegistration", registration);

app.use("/api/v1/userLogin", userLogin);

//http://localhost:3001/api/v1/userLogin/forgotPassword
app.use("/api/v1/userLogin", userLogin);

app.use("/api/v1/createProducts", createProducts);

//http://localhost:3001/api/v1/products/getAllProduct
app.use("/api/v1/products", createProducts);

//http://localhost:3001/api/v1/products/totalProductsCount
app.use("/api/v1/products", createProducts);

//http://localhost:3001/api/v1/products/deleteProduct/:id
app.use("/api/v1/products", createProducts);

//http://localhost:3001/api/v1/products/updateProduct/:id
app.use("/api/v1/products", createProducts);

//http://localhost:3001/api/v1/category/getcategories
app.use("/api/v1/category", createProducts);

//http://localhost:3001/api/v1/category/createCategory
app.use("/api/v1/category", createProducts);

//http://localhost:3001/api/v1/category/deleteCategory/:id
app.use("/api/v1/category", createProducts);

//http://localhost:3001/api/v1/category/categoryDetails
app.use("/api/v1/category", createProducts);

//http://localhost:3001/api/v1/category/updateCategory/:id
app.use("/api/v1/category", createProducts);

//http://localhost:3001/api/v1/productPurchase/orderProducts/:userId
app.use("/api/v1/productPurchase", productPurchase);

//http://localhost:3001/api/v1/productPurchase/getAllProductOrder
app.use("/api/v1/productPurchase", productPurchase);

//http://localhost:3001/api/v1/productPurchase/getUserProductOrder?userId=123&date=2024-10-02
app.use("/api/v1/productPurchase", productPurchase);

//http://localhost:3001/api/v1/productPurchase/totalOrderCount
app.use("/api/v1/productPurchase", productPurchase);

//starting server
db.query("SELECT 1")
  .then((data) => {
    app.listen(3001, () => {
      console.log("server is running at 3001 ");
    });
  })
  .catch((err) => console.log("db connection failed. \n", err));
