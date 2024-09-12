const moment = require('moment');
let express = require("express");
let cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const cors = require("cors");

let app = express();
app.use(fileUpload({
  createParentPath: true,
  useTempFiles: true,
}));

app.use(cookieParser());

app.use(cors());
app.options("*", cors());

app.use("/", (req, res, next) => {
  req.body && console.log(`[${moment().format("YYYY-MM-DD hh:mm:ss")}]`, "URL & PARAMS", req.url, req.query, `[user: ${req.headers["user-id"]}]`, req.method, JSON.stringify(req.body));
  next();
})

app.get("/healthcheck", (req, res) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  res.send({
    status: "ok"
  });
});

app.get("/", (req, res) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
});
app.post("/", (req, res) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
});
app.patch("/", (req, res) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
});

const bodyParser = require("body-parser");
app.use(bodyParser.json({limit: "10mb"})); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true, limit: "10mb"})); // support encoded bodies

module.exports = app;