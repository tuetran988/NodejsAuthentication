// config eviroment
require('dotenv').config()

const bodyParser = require("body-parser");
const express = require("express");
const logger = require("morgan"); // control client request
const mongoClient = require("mongoose");

const secureApp = require("helmet");
// setup connect mongodb  by mongoose

mongoClient
  .connect("mongodb://localhost/nodejsapistarter", {
    autoIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✔ connected database success");
  })
  .catch((error) => {
    console.error(`😢 connect failed error : ${error}`);
  });

const app = express();
app.use(secureApp());

const userRoute = require("./routes/user");
const deckRoute = require("./routes/deck");
// middleware run before handler but after client send request
app.use(logger("dev"));
app.use(bodyParser.json());
//router
app.use("/users", userRoute);
app.use("/decks", deckRoute);

//routes
app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Server is ok!",
  });
});

//catch 404 error and forward them  to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

//error handler function
app.use((err, req, res, next) => {
  const error = app.get("env") === "development" ? err : {};
  const status = err.status || 500;

  // response to client
  return res.status(status).json({
    error: {
      message: error.message,
    },
  });
});

// start the server
const port = app.get("port") || 3000;
app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
