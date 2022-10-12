const express = require("express");
const cors = require("cors");
const app = express();
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

app.use(express.json());
app.use(cookieParser());
//app.use(bodyParser.json)
app.use(bodyParser.urlencoded({ extended: true }));

const fileUpload = require("express-fileupload");
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Accept,Authorization, Content-Type,'Set-Cookie'"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,PATCH,DELETE");
    res.status(200).json({});
  }
  next();
});

const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const category = require("./routes/categoryRoute");
const cart = require("./routes/cartRoute");

app.use("/user", user);
app.use("/", product);
app.use("/", order);
app.use("/", category);
app.use("/", cart);

//middleware for error
app.use(errorMiddleware);

module.exports = app;
