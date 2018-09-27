const ItemList = require('../ItemList');
const dsmMessageCreator = require('./DSMMessageCreator');
const dsmSlackComms = require('./DSMSlackComms');
const DSM = require('../../models/DSM');

module.exports = {
    execute: function (action, dsmId, user, responseURL, res) {
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

                    postJoinDSMMessages(dsm);
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
                    dsm.join_ts_list.forEach(function (user) {
                        dsmSlackComms.deleteEphemeral()
                    });
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

function postJoinDSMMessages(dsm) {
    dsmSlackComms.getAllUsersInChannel(dsm.team.token).catch(console.log).then(function (allUsersResult) {
        console.log(allUsersResult);
        const allMembers = allUsersResult.members;
        dsmSlackComms.getChannelUsers(dsm.team.token, dsm.channel).catch(console.log).then(function (result) {
            console.log(result);
            const users = result.members;
            users.forEach(function (user) {
                const resultUser = allMembers.filter(obj => {
                    return obj.id === user
                });
                if (resultUser) {
                    console.log('Sending message to ' + resultUser);
                    const joinMsg = dsmMessageCreator.createJoinDsm(dsm, resultUser);
                    dsmSlackComms.postManageMsg(dsm.team.token, user, dsm, joinMsg);
                }
            })
        });
    });

}

function updateInProgressMsg(dsm) {
    const inProgressMsg = dsmMessageCreator.createInProgressMessage(dsm);
    dsmSlackComms.updateMessage(dsm.team.token, dsm.channel, dsm.message_ts, inProgressMsg);
}

function postSpeakerMsg(dsm) {
    const postSpeakerMsg = dsmMessageCreator.createSpeakerMessage(dsm);
    dsmSlackComms.postManageMsg(dsm.team.token, dsm.meeting.currentSpeaker, dsm, postSpeakerMsg);
}