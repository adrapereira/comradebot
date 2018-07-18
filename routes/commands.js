var PlanPokerList = require('../models/PlanPokerList');
const PlanPoker = require('../models/PlanPoker');
const planPokerMessageCreator = require('../helpers/PlanPokerMessageCreator');

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const crypto = require("crypto");
var slack = require('slack');
var request = require('request');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post('/pp', urlencodedParser, function(req, res) {
    var reqBody = req.body;
    if (reqBody.token != '99Sx8W87nzBjWNe9MBRZ8KRn'){
        res.status(403).end("Access forbidden")
    }else{
        res.status(200).end(); // best practice to respond with empty 200 status code
        const id = crypto.randomBytes(16).toString("hex");
        var responseURL = reqBody.response_url;
        const planPoker = new PlanPoker(id, reqBody.user_name, reqBody.channel_id, reqBody.text);
        PlanPokerList.add(planPoker);

        const message = planPokerMessageCreator.createVoting(planPoker);
        postMessage(planPoker, message);
        const creatorMessage = planPokerMessageCreator.createManaging(planPoker);
        postEphemeral(reqBody.user_id, planPoker, creatorMessage);
        // sendMessageToSlackResponseURL(responseURL, creatorMessage);
    }
});

function postEphemeral(userId, planPoker, message){
    slack.chat.postEphemeral({
        token: '***REMOVED***',
        channel: planPoker.channel,
        text: message.text,
        attachments: message.attachments,
        user: userId
    }).catch(console.log)
        .then(function(value) {
                planPoker.manage_message_ts = value.message_ts;
            }
        );
}

function postMessage(planPoker, message){
    slack.chat.postMessage({
        token: '***REMOVED***',
        channel: planPoker.channel,
        text: message.text,
        attachments: message.attachments
    }).catch(console.log)
        .then(function(value) {
            planPoker.message_ts = value.ts;
        }
     );
}

function sendMessageToSlackResponseURL(responseURL, message){
    var postOptions = {
        uri: responseURL,
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        json: message
    };
    request(postOptions, function (error, response, body){
        if (error){
            console.log(error);
        }
    });
}

module.exports = router;
