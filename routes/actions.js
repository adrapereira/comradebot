const planPokerList = require('../models/PlanPokerList');
const planPokerMessageCreator = require('../helpers/PlanPokerMessageCreator');
const planPokerSlackComms = require('../helpers/PlanPokerSlackComms');

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const urlencodedParser = bodyParser.urlencoded({extended: false});

router.post('/', urlencodedParser, function(req, res) {
    res.status(200).end(); // best practice to respond with 200 status
    const payload = JSON.parse(req.body.payload); // parse URL-encoded payload JSON string
    // const payload = req.body.payload;
    const buttonAction = payload.actions[0].value;
    const username = payload.user.name;
    const responseURL = payload.response_url;

    const actionResult = executeAction(buttonAction, username, responseURL);
    const planPoker = actionResult.planPoker;
    planPokerSlackComms.updateMessage(planPoker.team.token, planPoker.channel, planPoker.message_ts, actionResult.message);
});

function executeAction(buttonActionText, username, responseURL){
    const actionSplit = buttonActionText.split("@@@");
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
            message = planPokerMessageCreator.createVotingCanceled(planPoker);
            planPokerSlackComms.deleteEphemeral(planPoker.team.token, responseURL);
            break;
        case 'finish':
            const finishedResult = planPoker.finish();
            message = planPokerMessageCreator.createVotingFinished(planPoker, finishedResult);
            planPokerSlackComms.deleteEphemeral(planPoker.team.token,responseURL);
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
