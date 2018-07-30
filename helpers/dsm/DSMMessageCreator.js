const Constants = require('../../models/Constants');
const DSMCrypto = require('./DSMCrypto');

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
    createPreStartDsm: function (dsm) {
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
                            "name": "start",
                            "text": "Start",
                            "type": "button",
                            "value": "start@@@manage"
                        },
                        {
                            "name": "cancel",
                            "text": "Cancel",
                            "type": "button",
                            "value": "cancel@@@manage"
                        }
                    ]
                }
            ]
        };
        return message;
    },
    createJoinDsm: function (dsm, user) {
        const message = {
            "text": "",
            "attachments": [
                {
                    "text": dsm.creator + " started a new Daily Scrum Meeting",
                    "fallback": "Shame... buttons aren't supported in this land",
                    "callback_id": "dsm@@@" + dsm._id,
                    "color": Constants.SLACK_COLOR,
                    "attachment_type": "default",
                    "actions": [
                        {
                            "name": "join",
                            "text": "Join Meeting",
                            "type": "button",
                            "value": "join@@@manage",
                            "url": "https://scrumbot.tk/commands/dsm?d=" + DSMCrypto.encryptForUrl(dsm, user)
                        }
                    ]
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
                            "value": "skip@@@manage"
                        },
                        {
                            "name": "restart",
                            "text": "Restart",
                            "type": "button",
                            "value": "restart@@@manage"
                        },
                        {
                            "name": "cancel",
                            "text": "Cancel",
                            "type": "button",
                            "value": "cancel@@@manage"
                        }
                    ]
                }
            ]
        };
        return message;
    },
    createInProgressMessage(dsm) {
        let participantsDone = createParticipantsDone(dsm);
        if (participantsDone) {
            participantsDone = "\n" + participantsDone;
        }
        const currentSpeaker = "\n" + createCurrentSpeaker(dsm);
        const message = {
            "text": "",
            "attachments": [
                {
                    "text": "_Daily Scrum Meeting currently in progress._" + participantsDone + currentSpeaker,
                    "fallback": "Shame... buttons aren't supported in this land",
                    "callback_id": "dsm@@@" + dsm._id,
                    "color": Constants.SLACK_COLOR,
                    "attachment_type": "default"
                }
            ]
        };
        return message;
    },
    createSpeakerMessage(dsm) {
        const message = {
            "text": "",
            "attachments": [
                {
                    "text": "It's your turn to share your progress. Follow these questions to guide your discourse:\n" +
                        "1. What did you do yesterday?\n" +
                        "2. What will you do today?\n" +
                        "3. Are there any impediments in your way?",
                    "fallback": "Shame... buttons aren't supported in this land",
                    "callback_id": "dsm@@@" + dsm._id,
                    "color": Constants.SLACK_COLOR,
                    "attachment_type": "default",
                    "actions": [
                        {
                            "name": "endTurn",
                            "text": "End Turn",
                            "type": "button",
                            "value": "endTurn@@@manage"
                        }
                    ]
                }
            ]
        };
        return message;
    }
};

function createParticipantsDone(dsm) {
    let messages = [];
    dsm.meeting.participantsDone.forEach(function (id) {
        messages.push(dsm.participants[id].name + " - " + dsm.participants[id].time);
    });
    return messages.join("\n");
}

function createCurrentSpeaker(dsm) {
    const userId = dsm.meeting.currentSpeaker;
    return dsm.participants[userId].name + " :stopwatch:";
}

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
            "value": "link@@@" + "https://www.youtube.com/feed/subscriptions"
        });
    });
    return actions;
}