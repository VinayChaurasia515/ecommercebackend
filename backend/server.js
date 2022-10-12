const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

process.on("uncaughtException", (err) => {
  console.log(`Error :: ${err.message}`);
  console.log(`Shutting down the server due to uncaught Exception`);
  process.exit(1);
});

dotenv.config({ path: "backend/config/config.env" });
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(`server is working on ${process.env.PORT}`);
});

//unhandled Promise rejection

process.on("unhandledRejection", (err) => {
  console.log(`Error ::=> ${err.message}`);
  console.log(`Shuting down the server due to Unhandled Promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});
