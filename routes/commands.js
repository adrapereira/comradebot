const ItemList = require('../helpers/ItemList');
const PlanPoker = require('../models/PlanPoker');
const planPokerMessageCreator = require('../helpers/plan-poker/PlanPokerMessageCreator');
const planPokerSlackComms = require('../helpers/plan-poker/PlanPokerSlackComms');

const DSM = require('../models/DSM');
const dsmMessageCreator = require('../helpers/dsm/DSMMessageCreator');
const dsmSlackComms = require('../helpers/dsm/DSMSlackComms');
const Team = require('../models/Team');
const DSMCrypto = require('../helpers/dsm/DSMCrypto');


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
        res.status(200).json({"response_type": "in_channel"}); // post back the command as posted by the user
        const id = crypto.randomBytes(16).toString("hex");
        dbService.getItem(reqBody.team_id, function (dbItem) {
            let team = new Team();
            team.mapObjectToThis(dbItem);
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
        const id = crypto.randomBytes(16).toString("hex");;
        dbService.getItem(reqBody.team_id, function (dbItem) {
            let team = new Team();
            team.mapObjectToThis(dbItem);
            const dsm = new DSM(id, reqBody.user_name, reqBody.channel_id, team);
            ItemList.add(dsm);

            const message = dsmMessageCreator.createConfigureDsm(dsm);
            dsmSlackComms.postManageMsg(team.token, reqBody.user_id, dsm, message);
        });
    }
});

router.get('/dsm', urlencodedParser, function (req, res) {
    const decryptedString = DSMCrypto.decrypt(req.query.d);
    const dsmData = JSON.parse(decryptedString);

    ItemList.get(dsmData.id).then(function (item) {
        const dsm = new DSM();
        dsm.mapObjectToThis(item);
        dsm.addParticipant(dsmData.user);
        res.status(301).redirect(item.link);
    }).catch(console.log);
});

function isRequestValid(token) {
    return token === process.env.CLIENT_VERIFICATION_TOKEN;
}

module.exports = router;
