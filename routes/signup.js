const express = require('express');
const router = express.Router();
require('dotenv').config();

const slack = require('slack');
const dbService = require('../helpers/DBService');
const Team = require('../models/Team');

router.get('/', function(req, res) {
    res.status(200).end(); // best practice to respond with 200 status
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