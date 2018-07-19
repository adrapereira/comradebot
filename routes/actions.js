var planPokerList = require('../models/PlanPokerList');
const planPokerMessageCreator = require('../helpers/PlanPokerMessageCreator');
const planPokerSlackComms = require('../helpers/PlanPokerSlackComms');

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post('/', urlencodedParser, function(req, res) {
    res.status(200).end(); // best practice to respond with 200 status
    var payload = JSON.parse(req.body.payload); // parse URL-encoded payload JSON string
    // const payload = req.body.payload;
    const buttonAction = payload.actions[0].value;
    const username = payload.user.name;
    const responseURL = payload.response_url;

    const actionResult = executeAction(buttonAction, username, responseURL);
    const planPoker = actionResult.planPoker;
    planPokerSlackComms.updateMessage(planPoker.channel, planPoker.message_ts, actionResult.message);
});

function executeAction(buttonActionText, username, responseURL){
    var actionSplit = buttonActionText.split("@@@");
    const id = actionSplit[0];
    const action = actionSplit[1];
    const planPoker = planPokerList.get(id);
    let message;
    switch (action){
        case 'reset':
            planPoker.reset();
            message = planPokerMessageCreator.createVoting(planPoker);
            break;
        case 'cancel':
            planPokerList.remove(id);
            break;
        case 'finish':
            const finishedResult = planPoker.finish();
            message = planPokerMessageCreator.createVotingFinished(planPoker, finishedResult);
            planPokerSlackComms.deleteEphemeral(responseURL);
            break;
        case "0":
        case "1/2":
        case "1":
        case "2":
        case "3":
        case "5":
        case "8":
        case "13":
        case "20":
        case "40":
        case "100":
        case "?":
        case ":coffee:":
            planPoker.addVote(username, action);
            message = planPokerMessageCreator.createVoting(planPoker);
            break;
    }
    return {
        planPoker: planPoker,
        message: message
    };
}

module.exports = router;
