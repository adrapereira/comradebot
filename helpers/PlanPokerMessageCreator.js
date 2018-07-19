module.exports = {
    createVoting: function(planPoker){
        const usersThatVoted = usersThatVotedMessage(planPoker);
        var text = "Planning: *" + planPoker.title + "*";
        if(usersThatVoted){
            text += "\n_" + usersThatVoted + "_";
        }
        text += "\nPlease place your vote:";
        const message = {
            "text": planPoker.creator + " started a planning poker",
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
        let text = "Planning: *" + planPoker.title + "*";
        if(finished && finished.max){
            text += "\n" + joinVotes(planPoker);
            text += "\nMost voted: *" + finished.max.vote +" points* with *" + finished.max.count + "* vote";
            if(finished.max.count > 1){
                text += "s";
            }
        }else{
            text += "\n_The session ended without votes_";
        }

        const message = {
            "text": planPoker.creator + " started a planning poker",
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
            "text": planPoker.creator + " started a planning poker",
            "attachments": [
                {
                    "text": "Planning: *" + planPoker.title + "*\n_Voting session was canceled._",
                    "fallback": "Shame... buttons aren't supported in this land",
                    "callback_id": "plan-poker",
                    "color": "#3AA3E3",
                }
            ]
        };
        return message;
    },
    createManaging: function(planPoker){
        var text = "_Only you can manage the voting!_";
        text += "\nOnce everyone has placed their votes, click *Finish* to end the voting.";
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
    let votesAsString = [];
    for (let i = 0; i < voteKeys.length; i++) {
        const user = voteKeys[i];
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