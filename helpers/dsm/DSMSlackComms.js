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
    postManageMsg: function (token, userId, dsm, message) {
        SlackCommsBase.postEphemeral(token, userId, dsm.channel, message)
            .catch(console.log)
            .then(function (value) {
                    dsm.manage_message_ts = value.message_ts;
                    ItemList.update(dsm);
                }
            );
    },
    postJoinMsg: function (token, userId, dsm, message) {
        SlackCommsBase.postEphemeral(token, userId, dsm.channel, message)
            .catch(console.log)
            .then(function (value) {
                    dsm.join_ts_list.push(value.message_ts);
                    ItemList.update(dsm);
                }
            );
    },
    getChannelUsers: function (token, channel) {
        return SlackCommsBase.getChannelUsers(token, channel);
    },
    getAllUsersInChannel: function (token) {
        return SlackCommsBase.getAllUsersInWorkspace(token);
    },
    updateEphemeral: function (url, message) {
        SlackCommsBase.updateEphemeral(url, message);
    },
    deleteEphemeral: function (url) {
        SlackCommsBase.deleteEphemeral(url);
    }
};