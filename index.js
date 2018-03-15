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
  var action = req.body.action;
  var parameters = req.body.json;
  var result = "";
  getCall(req, res, function (result) {
    if (result) {
      console.log("result" + result.itemDetails.mktTitle);
      return res.json({
        productId: result.itemDetails.productId,
        mktTitle: result.itemDetails.mktTitle,
        salePriceMax: result.itemDetails.salePriceMax,
        rating: result.itemDetails.rating,
        reviewCount: result.itemDetails.reviewCount
      });
    }
  });


});

function getCall(req, res, callback) {

  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
  
  const https = require("https");
  const url =
    "https://btm-atg-jst-prd.ascenaretail.com/rest/model/com/ascena/rest/actor/ProductActor/itemDetails?productId=7771399&stockonHandFilter=true ";

  https.get(url, res => {
    res.setEncoding("utf8");
    let body = "";
    res.on("data", data => {
      body += data;
    });
    res.on("end", () => {
      body = JSON.parse(body);
      callback(body);
    });
  });
}
restService.listen(process.env.PORT || 8000, function () {
  console.log("Server up and listening");
});