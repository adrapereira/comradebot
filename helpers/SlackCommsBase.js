const slack = require('slack');
const request = require('request');

module.exports = {
    postMessage: function (token, channel, message) {
        return slack.chat.postMessage({
            token: token,
            channel: channel,
            text: message.text,
            attachments: message.attachments
        });
    },
    updateMessage: function (token, channel, ts, message) {
        return slack.chat.update({
            token: token,
            channel: channel,
            ts: ts,
            text: message.text,
            attachments: message.attachments
        });
    },
    deleteMessage: function (token, channel, ts) {
        return slack.chat.delete({
            token: token,
            channel: channel,
            ts: ts,
        });
    },
    postEphemeral: function (token, userId, channel, message) {
        return slack.chat.postEphemeral({
            token: token,
            channel: channel,
            text: message.text,
            attachments: message.attachments,
            user: userId
        });
    },
    getChannelUsers: function (token, channel) {
        return slack.conversations.members({
            token: token,
            channel: channel
        });
    },
    getAllUsersInWorkspace: function (token) {
        return slack.users.list({
            token: token
        });
    },
    updateEphemeral: function (url, message) {
        sendMessageToURL(url, {
            "response_type": "ephemeral",
            "replace_original": true,
            "delete_original": false,
            "text": message.text,
            "attachments": message.attachments
        });
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

function sendMessageToURL(url, message) {
    const postOptions = {
        uri: url,
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        json: message
    };
    request(postOptions, function (error, response, body) {
        if (error) {
            console.log(error);
        }
    });
}