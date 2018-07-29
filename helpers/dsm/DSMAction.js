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
                    console.log("duration");
                    dsm.duration = actionValue;
                    ItemList.update(dsm);
                    break;
                case 'link':
                    console.log("link");
                    dsm.link = actionValue;
                    ItemList.update(dsm);
                    message = dsmMessageCreator.createPreStartDsm(dsm);
                    dsmSlackComms.updateEphemeral(responseURL, message);
                    const joinMsg = dsmMessageCreator.createJoinDsm(dsm);
                    dsmSlackComms.postMessage(dsm.team.token, dsm, joinMsg);
                    break;
                case 'start':
                    console.log("start");
                    message = dsmMessageCreator.createManageDsm(dsm);
                    dsmSlackComms.updateEphemeral(responseURL, message);
                    break;
                case 'join':
                    console.log("join: " + user.name);
                    dsm.participants[user.id] = user;
                    message = dsmMessageCreator.createLinkDsm(dsm);
                    dsmSlackComms.postEphemeral(dsm.team.token, user.id, dsm, message);
                    break;
            }
        }).catch(console.log);
    }
};