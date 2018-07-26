const Constants = require('../../models/Constants');
module.exports = {
    createConfigureDsm: function (dsm) {
        const message = {
            "text": "Configure this Daily Scrum Meeting",
            "attachments": [
                {
                    "text": "_Pick the duration for the meeting, it will be equally divided among the participants._",
                    "fallback": "Shame... buttons aren't supported in this land",
                    "callback_id": "dsm@@@" + dsm._id,
                    "color": Constants.SLACK_COLOR,
                    "attachment_type": "default",
                    "actions": [
                        {
                            "name": "duration",
                            "text": "Choose the duration...",
                            "type": "select",
                            "options": createDurationActionList(['5', '10', '15', '20', '25', '30', '35', '40', '45']),
                            "selected_options": [createDurationAction('15')]
                        }
                    ]
                },
                {
                    "text": "_*Start the call* using on the available voice chat options_",
                    "fallback": "Shame... buttons aren't supported in this land",
                    "callback_id": "dsm@@@" + dsm._id,
                    "color": Constants.SLACK_COLOR,
                    "attachment_type": "default",
                    "actions": createDsmActions(['Slack Call', 'Hangouts', 'Add link'])
                }
            ]
        };
        return message;
    },
    createManageDsm: function (dsm) {
        const message = {
            "text": "",
            "attachments": [
                {
                    "text": "_Manage the current call. Duration: " + dsm.duration + "_",
                    "fallback": "Shame... buttons aren't supported in this land",
                    "callback_id": "dsm@@@" + dsm._id,
                    "color": Constants.SLACK_COLOR,
                    "attachment_type": "default",
                    "actions": [
                        {
                            "name": "skip",
                            "text": "Skip speaker",
                            "type": "button",
                            "value": "manage@@@skip"
                        },
                        {
                            "name": "restart",
                            "text": "Restart",
                            "type": "button",
                            "value": "manage@@@restart"
                        },
                        {
                            "name": "cancel",
                            "text": "Cancel",
                            "type": "button",
                            "value": "manage@@@cancel"
                        }
                    ]
                }
            ]
        };
        return message;
    }
};

function createDurationActionList(list) {
    const actions = [];
    list.forEach(function (value) {
        actions.push(createDurationAction(value));
    });
    return actions;
}

function createDurationAction(value) {
    return {
        "text": value + " minutes",
        "value": "duration@@@" + value
    }
}

function createDsmActions(numbers) {
    var actions = [];
    numbers.forEach(function (value) {
        actions.push({
            "name": "vote-" + value,
            "text": value,
            "type": "button",
            "value": "link@@@" + value
        });
    });
    return actions;
}