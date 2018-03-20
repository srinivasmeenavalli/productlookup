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
  //console.log('action='+action);  
  var parameters = req.body.json;
  var result = "";
  getCall(req, res, function (result) {
    if (result) {
      console.log("result" + result.templateTypes);
      var recordattr1 = result.contents[0].MainContent[0].MainContent[0].contents[0].records[0].attributes;
      var recordattr2 = result.contents[0].MainContent[0].MainContent[0].contents[0].records[1].attributes;
      
      return res.json({
        "speech": "",
        "messages": [
          {
            "type": 1,
            "platform": "facebook",
            "title": recordattr1.productDisplayName[0] ,
            "subtitle": recordattr1.productDisplayName[0] + "\n Rating:" + recordattr1['product.productRating']
            + "\n Rivuews:" + recordattr1['product.productReviewCount'],
            "template_type": "list",
            "top_element_style": "full",
            "imageUrl": "http://lanebryant.scene7.com/is/image/lanebryantProdATG/350328_0000003916?$large$&wid=170&hei=100",
            "buttons": [
              {
                "text": recordattr1.productDisplayName[0] + "\n Rating:" + recordattr1['product.productRating']
                  + "\n Rivuews:" + recordattr1['product.productReviewCount'],
                "imageUrl": "http://lanebryant.scene7.com/is/image/lanebryantProdATG/351047_0000008335?$medium$",
                "type": "web_url",
                "url": 'www.lanebryant.com'+recordattr1['product.seoUrl'],
                "messenger_extensions": true,
                "webview_height_ratio": "full",
                "postback": ""
              }
            ]
          },
          {
            "type": 1,
            "platform": "facebook",
            "title": recordattr1.productDisplayName[0] ,
            "subtitle": recordattr1.productDisplayName[0] + "\n Rating:" + recordattr1['product.productRating']
            + "\n Rivuews:" + recordattr1['product.productReviewCount'],
            "template_type": "list",
            "top_element_style": "full",
            "imageUrl": "http://lanebryant.scene7.com/is/image/lanebryantProdATG/239759_0000019850?$large$&wid=170&hei=100",
            "buttons": [
              {
                "text": recordattr1.productDisplayName[0] + "\n Rating:" + recordattr1['product.productRating']
                  + "\n Rivuews:" + recordattr1['product.productReviewCount'],
                "imageUrl": "http://lanebryant.scene7.com/is/image/lanebryantProdATG/351047_0000008335?$medium$",
                "type": "web_url",
                "url": 'www.lanebryant.com'+recordattr1['product.seoUrl'],
                "messenger_extensions": true,
                "webview_height_ratio": "full",
                "postback": ""
              }
            ]
          }
        ]
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
    path: '/lanebryant/search/?Ntt=shirts&format=json'
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