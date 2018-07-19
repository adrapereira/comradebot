var PlanPokerList = require('../models/PlanPokerList');
const PlanPoker = require('../models/PlanPoker');
const planPokerMessageCreator = require('../helpers/PlanPokerMessageCreator');
const planPokerSlackComms = require('../helpers/PlanPokerSlackComms');

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const crypto = require("crypto");

var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post('/pp', urlencodedParser, function(req, res) {
    var reqBody = req.body;
    if (reqBody.token != '99Sx8W87nzBjWNe9MBRZ8KRn'){
        res.status(403).end("Access forbidden")
    }else{
        res.status(200).end(); // best practice to respond with empty 200 status code
        const id = crypto.randomBytes(16).toString("hex");
        const planPoker = new PlanPoker(id, reqBody.user_name, reqBody.channel_id, reqBody.text);
        PlanPokerList.add(planPoker);

        const message = planPokerMessageCreator.createVoting(planPoker);
        planPokerSlackComms.postMessage(planPoker, message);
        const creatorMessage = planPokerMessageCreator.createManaging(planPoker);
        planPokerSlackComms.postEphemeral(reqBody.user_id, planPoker, creatorMessage);
    }
});

module.exports = router;
