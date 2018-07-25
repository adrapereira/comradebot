const Constants = require('../../models/Constants');
module.exports = {
    createConfigureDsm: function (dsm) {

        const message = {
            "text": dsm.creator + " started a Daily Scrum Meeting",
            "attachments": [
                {
                    "text": "",
                    "fallback": "Shame... buttons aren't supported in this land",
                    "callback_id": "dsm@@@" + dsm._id,
                    "color": Constants.SLACK_COLOR,
                    "attachment_type": "default",
                    "actions": createPlanPokerActions(['0', '1/2', '1', '2', '3'])
                }
            ]
        };
        return message;
    }
};


function createPlanPokerActions(numbers) {
    var actions = [];
    numbers.forEach(function (value) {
        actions.push({
            "name": "vote-" + value,
            "text": value,
            "type": "button",
            "value": value
        });
    });
    return actions;
}