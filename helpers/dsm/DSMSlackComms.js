const ItemList = require('../ItemList');
const SlackCommsBase = require('../SlackCommsBase');

module.exports = {
    postMessage: function (token, dsm, message) {
        SlackCommsBase.postMessage(token, dsm.channel, message)
            .catch(console.log)
            .then(function (value) {
                    dsm.message_ts = value.ts;
                    ItemList.update(dsm);
                }
            );
    },
    updateMessage: function (token, channel, ts, message) {
        SlackCommsBase.updateMessage(token, channel, ts, message)
            .then().catch(console.log);
    },
    deleteMessage: function (token, channel, ts) {
        SlackCommsBase.deleteMessage(token, channel, ts)
            .then().catch(console.log);
    },
    postEphemeral: function (token, userId, dsm, message) {
        SlackCommsBase.postEphemeral(token, userId, dsm.channel, message)
            .catch(console.log)
            .then(function (value) {
                    dsm.manage_message_ts = value.message_ts;
                    ItemList.update(dsm);
                }
            );
    },
    deleteEphemeral: function (url) {
        SlackCommsBase.deleteEphemeral(url);
    }
};