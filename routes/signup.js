const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');

const slack = require('slack');
const dbService = require('../helpers/DBService');
const Team = require('../models/Team');

const urlencodedParser = bodyParser.urlencoded({extended: false});

router.post('/', urlencodedParser, function(req, res) {
    res.status(200).end(); // best practice to respond with 200 status
    slack.oauth.token({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code: req.body.code
    }).then(function(data){
        console.log(data);
        const team = new Team(data.team_id, data.team_name, data.access_token);
        dbService.updateItem(team);
    }).catch(console.log);
});

module.exports = router;