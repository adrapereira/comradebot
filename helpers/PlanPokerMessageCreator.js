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
                    "callback_id": "plan-poker",
                    "color": "#3AA3E3",
                    "attachment_type": "default",
                    "actions": createPlanPokerActions(['0', '1/2', '1', '2', '3'],planPoker.id)
                },
                {
                    "fallback": "Shame... buttons aren't supported in this land",
                    "callback_id": "plan-poker",
                    "color": "#3AA3E3",
                    "attachment_type": "default",
                    "actions": createPlanPokerActions(['5', '8', '13', '20', '40'],planPoker.id)
                },
                {
                    "fallback": "Shame... buttons aren't supported in this land",
                    "callback_id": "plan-poker",
                    "color": "#3AA3E3",
                    "attachment_type": "default",
                    "actions": createPlanPokerActions(['100', '?', ":coffee:"], planPoker.id)
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
                    "color": "#3AA3E3",
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
                    "color": "#3AA3E3",
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
                    "callback_id": "plan-poker",
                    "color": "#3AA3E3",
                    "attachment_type": "default",
                    "actions": [
                        {
                            "name": "finish",
                            "text": "Finish",
                            "type": "button",
                            "value": joinIdAndValue(planPoker.id, "finish"),
                            "style": "primary"
                        },
                        {
                            "name": "reset",
                            "text": "Reset",
                            "type": "button",
                            "value": joinIdAndValue(planPoker.id, "reset"),
                        },
                        {
                            "name": "cancel",
                            "text": "Cancel",
                            "type": "button",
                            "value": joinIdAndValue(planPoker.id, "cancel"),
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
    let voteKeys = Object.keys(planPoker.votes);
    let voteKeysSorted = voteKeys.sort(function(a,b){return voteKeys[a]-list[b]})
    let votesAsString = [];
    for (let i = 0; i < voteKeysSorted.length; i++) {
        const user = voteKeysSorted[i];
        const vote = planPoker.votes[user];
        votesAsString.push(user + ": *" + vote + "*");
    }
    return votesAsString.join(", ");
}

function usersThatVotedMessage(planPoker){
    const users = Object.keys(planPoker.votes);
    if(users.length > 0){
        let endOfMessage = " have voted";
        if(users.length === 1){
            endOfMessage = " has voted";
        }
        const usersJoined = joinListString(users);
        return usersJoined + endOfMessage;
    }
    return undefined;
}

function joinListString(list){
    return [list.slice(0, -1).join(', '), list.slice(-1)[0]].join(list.length < 2 ? '' : ' and ');
}

function createPlanPokerActions(numbers, id){
    var actions = [];
    numbers.forEach(function (value) {
        actions.push({
            "name": "vote-" + value,
            "text": value,
            "type": "button",
            "value": joinIdAndValue(id, value)
        });
    });
    return actions;
}

function joinIdAndValue(id, value){
    return id + "@@@" + value;
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
        const emojis = [':beers:', ':tada:', ':clap:', ':exploding_head:', ':muscle'];
        result = " " + emojis.join(" ");
    }
    return result;
}