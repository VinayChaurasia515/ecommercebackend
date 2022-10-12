const mongoose = require("mongoose");

//const dburl="mongodb://localhost:27017/Ecommerce1"
//const dburl ="mongodb+srv://root:root@cluster0.webhwid.mongodb.net/?retryWrites=true&w=majority";

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then((data) => {
      console.log(`Mongodb connected with server : ${data.connection.host}`);
    })
    .catch((err) => {
      console.log("Not Connected ", err);
    });
};

module.exports = connectDatabase;
