const PlanPokerList = require('../models/PlanPokerList');
const PlanPoker = require('../models/PlanPoker');
const planPokerMessageCreator = require('../helpers/PlanPokerMessageCreator');
const planPokerSlackComms = require('../helpers/PlanPokerSlackComms');

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const crypto = require("crypto");
const dbService = require("../helpers/DBService");

var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post('/pp', urlencodedParser, function(req, res) {
    var reqBody = req.body;
    if (reqBody.token != '99Sx8W87nzBjWNe9MBRZ8KRn'){
        res.status(403).end("Access forbidden")
    }else{
        res.status(200).end(); // best practice to respond with empty 200 status code
        const id = crypto.randomBytes(16).toString("hex");
        dbService.getItem(reqBody.team_id, function(team){
            const planPoker = new PlanPoker(id, reqBody.user_name, reqBody.channel_id, reqBody.text, team);
            PlanPokerList.add(planPoker);

            const message = planPokerMessageCreator.createVoting(planPoker);
            planPokerSlackComms.postMessage(team.token, planPoker, message);
            const creatorMessage = planPokerMessageCreator.createManaging(planPoker);
            planPokerSlackComms.postEphemeral(team.token, reqBody.user_id, planPoker, creatorMessage);
        });
    }
});

module.exports = router;
