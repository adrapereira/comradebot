const planPokerList = require('../models/PlanPokerList');
const planPokerMessageCreator = require('../helpers/PlanPokerMessageCreator');
const planPokerSlackComms = require('../helpers/PlanPokerSlackComms');

module.exports = {
    execute: function (action, planPokerId, username, responseURL) {
        planPokerList.get(planPokerId).then(function (pp) {
            let planPoker = pp;
            console.log(planPoker);
            let message;
            switch (action){
                case 'reset':
                    planPoker.reset();
                    message = planPokerMessageCreator.createVoting(planPoker);
                    break;
                case 'cancel':
                    planPokerList.remove(planPokerId);
                    message = planPokerMessageCreator.createVotingCanceled(planPoker);
                    planPokerSlackComms.deleteEphemeral(responseURL);
                    break;
                case 'finish':
                    planPokerList.remove(planPokerId);
                    const finishedResult = planPoker.finish();
                    message = planPokerMessageCreator.createVotingFinished(planPoker, finishedResult);
                    planPokerSlackComms.deleteEphemeral(responseURL);
                    break;
                case "0"  : case "1/2" : case "1"  : case "2" :
                case "3"  : case "5"   : case "8"  : case "13":
                case "20" : case "40"  : case "100": case "?" :
                case ":coffee:":
                    if(planPoker){
                        planPoker.addVote(username, action);
                        message = planPokerMessageCreator.createVoting(planPoker);
                    }
                    break;
            }
            if(planPoker){
                planPokerSlackComms.updateMessage(planPoker.team.token, planPoker.channel, planPoker.message_ts, message);
            }
        }).catch(console.log);

    }
};