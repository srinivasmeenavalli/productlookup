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
  //let action = req.body.result.action; 
  console.log('action='+req);  
  var parameters = req.body.json;
  var result = "";
  getCall(req, res, function (result) {
    if (result) {
      console.log("templateTypes=" + result.templateTypes);
      return res.json({
        "data": {
          "facebook": {
              "attachment": {
                  "type": "template",
                  "payload": {
                      "template_type": "list",
                      "elements": result.contents
                  }
              }
          }
      }

             
      });
    }
  });


});

function getCall(req, res, callback) {

  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

  const https = require("https");
  
  // options
  var options = {
    host: 'www.lanebryant.com',
    path: '/lanebryant/clp/?N=11286&format=json'
  }

  https.get(options, res => {
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