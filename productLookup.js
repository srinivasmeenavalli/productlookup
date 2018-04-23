"use strict";

var body = "";
const express = require("express");
const bodyParser = require("body-parser");

const restService = express();

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

restService.post("/webhook", function (req, res) {
  var speech =
    req.body.result &&
      req.body.result.parameters &&
      req.body.result.parameters.echoText
      ? req.body.result.parameters.echoText
      : "Seems like some problem. Speak again.";
  var parameters = req.body.json;
  var CircularJSON = require('circular-json');
  var jsonresp = CircularJSON.stringify(req);
  var body = "";
  var jsonObj = "";
  req.on('data', function (chunk) {
    body += chunk;
  });
  var productId = "";

  req.on('end', function (productId) {
    console.log('body: ' + body);
    jsonObj = JSON.parse(body);
    productId = jsonObj.id;
    console.log("productId=" + productId);
    getCall(req, res, productId, function (result) {
      if (result) {
        console.log("result=" + result.templateTypes);
        var recordattr1 = result.contents[0].MainContent[0].MainContent[0].contents[0].records[0].attributes;
        //return result;
        return res.json(recordattr1);
      }
    });
  })




});

function getCall(req, res, productId, callback) {

  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

  const https = require("https");
  console.log("productId=" + productId);
  var path = "/lanebryant/search/?Ntt=" + productId + "&format=json";
  console.log("path=" + path);
  // options
  var options = {
    host: 'www.lanebryant.com',
    path: path
  }

  https.get(options, res => {
    res.setEncoding("utf8");
    let body = "";
    res.on("data", data => {
      body += data;
    });
    res.on("end", () => {
      body = JSON.parse(body);
      console.log("response=" + body.templateTypes);
      callback(body);
    });
  });
}
restService.listen(process.env.PORT || 8000, function () {
  console.log("Server up and listening");
});