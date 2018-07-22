const express = require('express');
const router = express.Router();
require('dotenv').config();

const slack = require('slack');
const dbService = require('../helpers/DBService');
const Team = require('../models/Team');

router.get('/', function(req, res) {
    res.status(200).end(); // best practice to respond with 200 status
    console.log("code: " + JSON.stringify(req.query.code));
    console.log("env: " + JSON.stringify(process.env));
    console.log("client_id: " + process.env.CLIENT_ID);
    console.log("client_secret: " + process.env.CLIENT_SECRET);
    slack.oauth.token({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code: req.query.code
    }).then(function(data){
        console.log(data);
        const team = new Team(data.team_id, data.team_name, data.access_token);
        dbService.updateItem(team);
    }).catch(console.log);
});

module.exports = router;