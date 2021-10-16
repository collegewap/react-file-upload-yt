const express = require("express");
const cors = require("cors");
const multer = require("multer");

const upload = require("./upload");

const app = express();

//Add the client URL to the CORS policy
const whitelist = ["http://localhost:3000"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

app.post("/upload_file", upload.single("file"), function (req, res) {
  if (!req.file) {
    throw Error("FILE_MISSING");
  } else {
    res.send({ status: "success" });
  }
});

//Error handling
app.use(function (err, req, res, next) {
  if (err instanceof multer.MulterError) {
    res.statusCode = 400;
    res.send({ code: err.code });
  } else if (err) {
    if (err.message === "FILE_MISSING" || err.message === "INVALID_TYPE") {
      res.statusCode = 400;
      res.send({ code: err.message });
    } else {
      res.statusCode = 500;
      res.send({ code: "GENERIC_ERROR" });
    }
  }
});

const server = app.listen(8081, function () {
  console.log("Server started at 8081");
});
