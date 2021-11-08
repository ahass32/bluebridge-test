const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser());

app.get("/", function (req, res) {
  res.send("Auth service");
});

const username = "admin";
const password = "1234";

app.post("/login", function (req, res) {
  if (!req.body.username || !req.body.password)
    return res.status(400).send("Username or password wrong");
  if (req.body.username !== username || req.body.password !== password) {
    return res.send("Username or password wrong");
  }
  res.status(200).send("Login successful");
});

app.listen(3001);
