const ItemList = require('../helpers/ItemList');
const PlanPoker = require('../models/PlanPoker');
const planPokerMessageCreator = require('../helpers/plan-poker/PlanPokerMessageCreator');
const planPokerSlackComms = require('../helpers/plan-poker/PlanPokerSlackComms');

const DSM = require('../models/DSM');
const dsmMessageCreator = require('../helpers/dsm/DSMMessageCreator');
const dsmSlackComms = require('../helpers/dsm/DSMSlackComms');

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
require('dotenv').config();
const crypto = require("crypto");
const dbService = require("../helpers/DBService");

var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post('/pp', urlencodedParser, function(req, res) {
    var reqBody = req.body;
    if (!isRequestValid(reqBody.token)) {
        res.status(403).end("Access forbidden")
    }else{
        res.status(200).end(); // best practice to respond with empty 200 status code
        const id = crypto.randomBytes(16).toString("hex");
        dbService.getItem(reqBody.team_id, function(team){
            const planPoker = new PlanPoker(id, reqBody.user_name, reqBody.channel_id, reqBody.text, team);
            ItemList.add(planPoker);

            const message = planPokerMessageCreator.createVoting(planPoker);
            planPokerSlackComms.postMessage(team.token, planPoker, message);
            setTimeout(function (){
                const creatorMessage = planPokerMessageCreator.createManaging(planPoker);
                planPokerSlackComms.postEphemeral(team.token, reqBody.user_id, planPoker, creatorMessage);
            }, 1000);
        });
    }
});

router.post('/dsm', urlencodedParser, function (req, res) {
    const reqBody = req.body;
    if (!isRequestValid(reqBody.token)) {
        res.status(403).end("Access forbidden")
    } else {
        res.status(200).end(); // best practice to respond with empty 200 status code
        const id = crypto.randomBytes(16).toString("hex");
        dbService.getItem(reqBody.team_id, function (team) {
            const dsm = new DSM(id, reqBody.user_name, reqBody.channel_id, team);
            ItemList.add(dsm);

            const message = dsmMessageCreator.createConfigureDsm(dsm);
            dsmSlackComms.postMessage(team.token, dsm, message);
        });
    }
});

function isRequestValid(token) {
    return token === process.env.CLIENT_VERIFICATION_TOKEN;
}

module.exports = router;
