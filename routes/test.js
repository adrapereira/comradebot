const express = require('express');
const router = express.Router();
require('dotenv').config();

const ChartsService = require('../helpers/ChartsService');

router.get('/', function(req, res) {
    ChartsService.generateDoughnut("bla");
});

module.exports = router;