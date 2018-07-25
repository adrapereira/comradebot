const ItemList = require('../ItemList');
const SlackCommsBase = require('../SlackCommsBase');

module.exports = {
    postMessage: function (token, planPoker, message) {
        SlackCommsBase.postMessage(token, planPoker.channel, message)
            .catch(console.log)
            .then(function (value) {
                    planPoker.message_ts = value.ts;
                ItemList.update(planPoker);
                }
            );
    },
    updateMessage: function (token, channel, ts, message) {
         SlackCommsBase.updateMessage(token, channel, ts, message)
             .then().catch(console.log);
    },
    deleteMessage: function (token, channel, ts){
        SlackCommsBase.deleteMessage(token, channel, ts)
            .then().catch(console.log);
    },
    postEphemeral: function(token, userId, planPoker, message){
        SlackCommsBase.postEphemeral(token, userId, planPoker.channel, message)
            .catch(console.log)
            .then(function(value) {
                    planPoker.manage_message_ts = value.message_ts;
                ItemList.update(planPoker);
                }
            );
    },
    deleteEphemeral: function (url) {
        SlackCommsBase.deleteEphemeral(url);
    }
};