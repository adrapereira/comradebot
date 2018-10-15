const Constants = require('../../models/Constants');
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
        let text = "";
        if(finished && finished.max){
            text += "" + joinVotes(planPoker);
            text += buildMostVotedMsg(finished.max);
            text += buildAllSameMsg(finished.allSame);
        }else{
            text += "_The session ended without votes_";
        }

        const message = {
            "text": planPoker.creator + " started a planning poker: *" + planPoker.title + "*",
            "attachments": [
                {
                    "text": text,
                    "fallback": "Shame... buttons aren't supported in this land",
                    "callback_id": "plan-poker",
                    "color": Constants.SLACK_COLOR,
                }
            ]
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

function joinVotes(planPoker){
    let sortedVotes = planPoker.votes.sort(function(a, b) {
        return a.value - b.value;
    });
    let votesAsString = [];
    for (const entry of sortedVotes.entries()) {
        const user = entry[0],
        vote = entry[1];
        votesAsString.push(user + ": *" + vote + "*");
    }
    return votesAsString.join(", ");
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

function buildMostVotedMsg(maxMap){
    let result = "\nMost voted: *" + maxMap.vote + " point";
    if(parseInt(maxMap) !== 1){
        result += "s";
    }
    result += "*";
    return result;
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