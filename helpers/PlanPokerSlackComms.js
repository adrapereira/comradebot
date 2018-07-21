const slack = require('slack');
const request = require('request');

module.exports = {
    postMessage: function (token, planPoker, message) {
        slack.chat.postMessage({
            token: token,
            channel: planPoker.channel,
            text: message.text,
            attachments: message.attachments
        }).catch(console.log)
            .then(function (value) {
                    planPoker.message_ts = value.ts;
                }
            );
    },
     updateMessage: function(token, channel, ts, message){
        slack.chat.update({
            token: token,
            channel: channel,
            ts: ts,
            text: message.text,
            attachments: message.attachments
        }).then().catch(console.log);
    },
    deleteMessage: function (token, channel, ts){
        slack.chat.delete({
            token: token,
            channel: channel,
            ts: ts,
        }).then().catch(console.log);
    },
    postEphemeral: function(token, userId, planPoker, message){
        slack.chat.postEphemeral({
            token: token,
            channel: planPoker.channel,
            text: message.text,
            attachments: message.attachments,
            user: userId
        }).catch(console.log)
            .then(function(value) {
                    planPoker.manage_message_ts = value.message_ts;
                }
            );
    },
    deleteEphemeral: function (url) {
        sendMessageToURL(url, {
            "response_type": "ephemeral",
            "replace_original": true,
            "delete_original": true,
            "text": ""
        });
    }
};

function sendMessageToURL(url, message){
    var postOptions = {
        uri: url,
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        json: message
    };
    request(postOptions, function (error, response, body){
        if (error){
            console.log(error);
        }
    });
}