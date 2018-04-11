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
      
  console.log(jsonresp);
   
  //console.log('intentName='+req.body.result.metadata.intentName);  
    
  
  var result = "";
  getCall(req, res, function (result) {
    if (result) {
      console.log("result" + result.templateTypes);
      var recordattr1 = result.contents[0].MainContent[0].MainContent[0].contents[0].records[0].attributes;
      var recordattr2 = result.contents[0].MainContent[0].MainContent[0].contents[0].records[1].attributes;
      var recordattr3 = result.contents[0].MainContent[0].MainContent[0].contents[0].records[2].attributes;

      return res.json({
        "speech": "",
        "imageUrl": "http://lanebryant.scene7.com/is/image/lanebryantProdATG/351047_0000008335?$medium$",

        "messages": [
          {
            "type": 1,
            "platform": "facebook",
            "title": recordattr1.productDisplayName[0],
            "subtitle": recordattr1.productDisplayName[0] + "\n Rating:" + recordattr1['product.productRating']
              + "\n Reviews Count:" + recordattr1['product.productReviewCount'],
            "template_type": "list",
            "top_element_style": "full",
            "imageUrl": "http://lanebryant.scene7.com/is/image/lanebryantProdATG/"+recordattr1['sku.imageURL'][0]+"?$large$&wid=490&hei=350",            
            "buttons": [
              {
                "text": "Suggestions",                
                "imageUrl": "http://lanebryant.scene7.com/is/image/lanebryantProdATG/351047_0000008335?$medium$",
                "type": "web_url",
                "url": "www.lanebryant.com" + recordattr1['product.seoUrl'],
                "messenger_extensions": true,
                "webview_height_ratio": "full",
                "postback": "www.lanebryant.com" + recordattr1['product.seoUrl']
              }
            ]
          },
          {
            "type": 1,
            "platform": "facebook",
            "title": recordattr2.productDisplayName[0],
            "subtitle": recordattr2.productDisplayName[0] + "\n Rating:" + recordattr2['product.productRating']
              + "\n Reviews Count:" + recordattr2['product.productReviewCount'],
            "template_type": "list",
            "top_element_style": "full",
            "imageUrl": "http://lanebryant.scene7.com/is/image/lanebryantProdATG/"+recordattr2['sku.imageURL'][0]+"?$large$&wid=490&hei=350",
            "buttons": [
              {
                "text": "Suggestions",                
                "type": "web_url",
                "url": "www.lanebryant.com" + recordattr2['product.seoUrl'],
                "messenger_extensions": true,
                "webview_height_ratio": "full",
                "postback": "www.lanebryant.com" + recordattr2['product.seoUrl']
              },

            ]
          },
          {
            "type": 1,
            "platform": "facebook",
            "title": recordattr3.productDisplayName[0],
            "subtitle": recordattr3.productDisplayName[0] + "\n Rating:" + recordattr3['product.productRating']
              + "\n Reviews Count:" + recordattr3['product.productReviewCount'],
            "template_type": "list",
            "top_element_style": "full",
            "imageUrl": "http://lanebryant.scene7.com/is/image/lanebryantProdATG/"+recordattr3['sku.imageURL'][0]+"?$large$&wid=490&hei=350",
            "buttons": [
              {
                "text": "Suggestions",                               
                "type": "web_url",
                "url": "www.lanebryant.com" + recordattr3['product.seoUrl'],
                "messenger_extensions": true,
                "webview_height_ratio": "full",
                "postback": "www.lanebryant.com" + recordattr3['product.seoUrl']
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
    path: '/lanebryant/search/?Ntt=jeans&format=json'
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