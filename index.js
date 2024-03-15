require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

// Basic Configuration
const port = process.env.PORT || 3000;

let short_url_number = 1;
const urlsArray = [];

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", (req, res) => {
  const { url } = req.body;
  const urlPattern =
    /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  if (!urlPattern.test(url)) res.json({ error: "Invalid URL" });
  const urlObject = { original_url: url, short_url: short_url_number };
  res.json(urlObject);
  urlsArray.push(urlObject);
  short_url_number++;
});

app.get("/api/shorturl/:urlID", (req, res) => {
  const { urlID } = req.params;
  const foundObject = urlsArray.find(
    (url) => url.short_url === parseInt(urlID)
  );
  res.redirect(foundObject.original_url);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
