const ItemList = require('../ItemList');
const dsmMessageCreator = require('./DSMMessageCreator');
const dsmSlackComms = require('./DSMSlackComms');
const DSM = require('../../models/DSM');

module.exports = {
    execute: function (action, dsmId, user, responseURL) {
        ItemList.get(dsmId).then(function (item) {
            let dsm = new DSM();
            dsm.mapObjectToThis(item);

            const actionSplit = action.split("@@@");
            const actionType = actionSplit[0];
            const actionValue = actionSplit[1];

            console.log({actionSplit});

            let message;
            switch (actionType) {
                case 'duration':
                    dsm.duration = actionValue;
                    ItemList.update(dsm);
                    break;
                case 'link':
                    dsm.link = actionValue;
                    ItemList.update(dsm);
                    message = dsmMessageCreator.createPreStartDsm(dsm);
                    dsmSlackComms.updateEphemeral(responseURL, message);
                    const joinMsg = dsmMessageCreator.createJoinDsm(dsm, user);
                    dsmSlackComms.postMessage(dsm.team.token, dsm, joinMsg);
                    break;
                case 'start':
                    message = dsmMessageCreator.createManageDsm(dsm);
                    dsmSlackComms.updateEphemeral(responseURL, message);

                    console.log("start");
                    dsm.start();
                    const participantsLeft = dsm.nextParticipant();
                    if (participantsLeft) {
                        postSpeakerMsg(dsm);
                    }
                    updateInProgressMsg(dsm);
                    break;
                case 'endTurn':
                    console.log("endTurn");

                    if (dsm.meeting.currentSpeaker === user.id) {
                        console.log("speaker is the same");

                        const participantsLeft = dsm.nextParticipant();
                        dsmSlackComms.deleteEphemeral(responseURL);
                        if (participantsLeft) {
                            postSpeakerMsg(dsm);
                        }
                    }
                    updateInProgressMsg(dsm);
                    break;
            }
        }).catch(console.log);
    }
};

function updateInProgressMsg(dsm) {
    const inProgressMsg = dsmMessageCreator.createInProgressMessage(dsm);
    dsmSlackComms.updateMessage(dsm.team.token, dsm.channel, dsm.message_ts, inProgressMsg);
}

function postSpeakerMsg(dsm) {
    const postSpeakerMsg = dsmMessageCreator.createSpeakerMessage(dsm);
    dsmSlackComms.postEphemeral(dsm.team.token, dsm.meeting.currentSpeaker, dsm, postSpeakerMsg);
}