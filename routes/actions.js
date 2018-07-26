const planPokerAction = require('../helpers/plan-poker/PlanPokerAction');
const dsmAction = require('../helpers/dsm/DSMAction');

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const urlencodedParser = bodyParser.urlencoded({extended: false});

router.post('/', urlencodedParser, function(req, res) {
    res.status(200).end(); // best practice to respond with 200 status
    const payload = JSON.parse(req.body.payload);
    // const payload = req.body.payload;

    let buttonAction = payload.actions[0].value;
    if (!buttonAction) {
        buttonAction = payload.actions[0].selected_options[0].value;
    }
    const username = payload.user.name;
    const responseURL = payload.response_url;
    const callbackId = payload.callback_id;

    executeAction(callbackId, buttonAction, username, responseURL);
});

function executeAction(callbackId, buttonAction, username, responseURL){
    const actionSplit = callbackId.split("@@@");
    const actionType = actionSplit[0];
    const actionId = actionSplit[1];
    switch (actionType){
        case 'pp':
            planPokerAction.execute(buttonAction, actionId, username, responseURL);
            break;
        case 'dsm':
            dsmAction.execute(buttonAction, actionId, username, responseURL);
            break;
    }
}

module.exports = router;
