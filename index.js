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
      return res.json({
        "facebook": {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": [
                {
                  "title": "Smurfs: The Lost Village (2017)",
                  "image_url": "https://www.moovrika.com/ext/makeimg.php?tbl=movies&id=15666&img=1&type=image&movie=Smurfs+The+Lost+Village&fs=400",
                  "subtitle": "Smurfette attempts to find her purpose in the village. When she encounters a creature in the Forbidden Forest who drops a mysterious map, she sets off with her friends Brainy, Clumsy, and Hefty on an adventure to find the Lost Village before the evil wizard Gargamel does.",
                  "default_action": {
                    "type": "web_url",
                    "url": "https://www.moovrika.com/m/15666",
                    "webview_height_ratio": "tall"
                  },
                  "buttons": [
                    {
                      "title": "more info",
                      "type": "web_url",
                      "url": "https://www.moovrika.com/m/4082",
                      "webview_height_ratio": "tall"
                    },
                    {
                      "title": "View trailer",
                      "type": "web_url",
                      "url": "https://www.moovrika.com/m/4082",
                      "webview_height_ratio": "tall"
                    }
                  ]
                },
                {
                  "title": "Resident Evil: The Final Chapter (2017)",
                  "image_url": "https://www.moovrika.com/ext/makeimg.php?tbl=movies&id=4167&img=1&type=image&movie=Resident+Evil+The+Final+Chapter&fs=400",
                  "subtitle": "Resident Evil: The Final Chapter is an upcoming science fiction action horror film written and directed by Paul W. S. Anderson. It is the sequel to Resident Evil: Retribution (2012), and will be the sixth and final installment in the Resident Evil film series, which is very loosely based on the Capcom survival horror video game series Resident Evil.",
                  "default_action": {
                    "type": "web_url",
                    "url": "https://www.moovrika.com/m/4167",
                    "webview_height_ratio": "tall"
                  },
                  "buttons": [
                    {
                      "title": "more info",
                      "type": "web_url",
                      "url": "https://www.moovrika.com/m/4082",
                      "webview_height_ratio": "tall"
                    }
                  ]
                }
              ]
            }

          }

        },
        "kik": {
          "type": "",
          "body": ""
        },
        "slack": {
          "text": "",
          "attachments": []
        },
        "telegram": {
          "text": ""
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