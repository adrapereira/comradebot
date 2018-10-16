const Constants = require('../../models/Constants');
const util = require('util');

module.exports = {
    createVoting: function(planPoker){
        const usersThatVoted = usersThatVotedMessage(planPoker);
        var text = "";
        if(usersThatVoted){
            text += "_" + usersThatVoted + "_\n";
        }
        text += "Please place your vote:";
        const message = {
            "text": planPoker.creator + " started a planning poker: *" + planPoker.title + "*",
            "attachments": [
                {
                    "text": text,
                    "fallback": "Shame... buttons aren't supported in this land",
                    "callback_id": "pp@@@" + planPoker._id,
                    "color": Constants.SLACK_COLOR,
                    "attachment_type": "default",
                    "actions": createPlanPokerActions(['0', '1/2', '1', '2', '3'])
                },
                {
                    "fallback": "Shame... buttons aren't supported in this land",
                    "callback_id": "pp@@@" + planPoker._id,
                    "color": Constants.SLACK_COLOR,
                    "attachment_type": "default",
                    "actions": createPlanPokerActions(['5', '8', '13', '20', '40'])
                },
                {
                    "fallback": "Shame... buttons aren't supported in this land",
                    "callback_id": "pp@@@" + planPoker._id,
                    "color": Constants.SLACK_COLOR,
                    "attachment_type": "default",
                    "actions": createPlanPokerActions(['100', '?', ":coffee:"])
                }
            ]
        };
        return message;
    },
    createVotingFinished: function(planPoker, finished){
        let attachmentsList = [];

        if(finished && finished.max){
            attachmentsList.push(buildMostVotedAttachment(finished));
            attachmentsList.push(buildVotesAttachment(planPoker));
        }else{
            attachmentsList.push({
                "text": "_The session ended without votes_",
                "fallback": "_The session ended without votes_",
                "callback_id": "plan-poker",
                "color": Constants.SLACK_COLOR,
            });
        }

        const message = {
            "text": planPoker.creator + " started a planning poker: *" + planPoker.title + "*",
            "attachments": attachmentsList
        };
        return message;
    },
    createVotingCanceled: function(planPoker){
        const message = {
            "text": planPoker.creator + " started a planning poker: *" + planPoker.title + "*",
            "attachments": [
                {
                    "text": "_Voting session was canceled._",
                    "fallback": "Shame... buttons aren't supported in this land",
                    "callback_id": "plan-poker",
                    "color": Constants.SLACK_COLOR,
                }
            ]
        };
        return message;
    },
    createManaging: function(planPoker){
        const text = "_Only you can manage the voting!_\nOnce everyone has placed their votes, click *Finish* to end the voting.";
        const message = {
            "text": "",
            "attachments": [
                {
                    "text": text,
                    "fallback": "Shame... buttons aren't supported in this land",
                    "callback_id": "pp@@@" + planPoker._id,
                    "color": Constants.SLACK_COLOR,
                    "attachment_type": "default",
                    "actions": [
                        {
                            "name": "finish",
                            "text": "Finish",
                            "type": "button",
                            "value": "finish",
                            "style": "primary"
                        },
                        {
                            "name": "reset",
                            "text": "Reset",
                            "type": "button",
                            "value": "reset",
                        },
                        {
                            "name": "cancel",
                            "text": "Cancel",
                            "type": "button",
                            "value": "cancel",
                            "style": "danger"
                        }
                    ]
                }
            ]
        };
        return message;
    }
};

function buildVotesAttachment(planPoker){
    let voteAttachments = [];

    // Sort by value
    planPoker.votes[Symbol.iterator] = function* () {
        yield* [...this.entries()].sort((a, b) => a[1] - b[1]);
    };

    // Create an attachment for each group of 5 users
    let votesAsString = [];
    for (let [user, vote] of planPoker.votes) {
        votesAsString.push(util.format("`%s`: *%s*", user, vote));
        console.log("size: " + votesAsString.length);
        if(votesAsString.length === 5){
            console.log("adding new attachment");
            voteAttachments.push(createVoteAttachment(votesAsString));
            votesAsString = [];
        }
    }
    console.log("attachments: " + voteAttachments.length);
    if(votesAsString.length > 0){
        voteAttachments.push(createVoteAttachment(votesAsString));
    }
    return voteAttachments;
}

function createVoteAttachment(votesAsString){
    const fullVotes = votesAsString.join("\n");
    return {
        "text": fullVotes,
        "fallback": fullVotes,
        "callback_id": "plan-poker",
        "color": Constants.SLACK_COLOR,
    };
}

function usersThatVotedMessage(planPoker){
    if(planPoker.votes.size > 0){
        let endOfMessage = " have voted";
        if(planPoker.votes.size === 1){
            endOfMessage = " has voted";
        }
        const usersJoined = joinListString(Array.from(planPoker.votes.keys()));
        return usersJoined + endOfMessage;
    }
    return undefined;
}

function joinListString(list){
    return [list.slice(0, -1).join(', '), list.slice(-1)[0]].join(list.length < 2 ? '' : ' and ');
}

function createPlanPokerActions(numbers){
    var actions = [];
    numbers.forEach(function (value) {
        actions.push({
            "name": "vote-" + value,
            "text": value,
            "type": "button",
            "value": value
        });
    });
    return actions;
}

function buildMostVotedAttachment(finished){
    let result = "\nMost voted: *" + finished.max.vote + " point";
    if(parseInt(finished.max) !== 1){
        result += "s";
    }
    result += "*";
    result += buildAllSameMsg(finished.allSame);

    return {
        "text": result,
        "fallback": result,
        "callback_id": "plan-poker",
        "color": Constants.SLACK_COLOR,
    };
}

function buildAllSameMsg(allSame){
    let result = "";
    if(allSame){
        const emojis = [':beers:', ':tada:', ':clap:', ':exploding_head:', ':muscle:'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        result = " " + randomEmoji;
    }
    return result;
}