const ItemList = require('../ItemList');
const planPokerMessageCreator = require('./PlanPokerMessageCreator');
const planPokerSlackComms = require('./PlanPokerSlackComms');
const PlanPoker = require('../../models/PlanPoker');

module.exports = {
    execute: function (action, planPokerId, userId, responseURL) {
        ItemList.get(planPokerId).then(function (pp) {
            let planPoker = new PlanPoker();
            planPoker.mapObjectToThis(pp);

            let message;
            switch (action){
                case 'reset':
                    planPoker.reset();
                    ItemList.update(planPoker);
                    message = planPokerMessageCreator.createVoting(planPoker);
                    break;
                case 'cancel':
                    ItemList.remove(planPokerId);
                    message = planPokerMessageCreator.createVotingCanceled(planPoker);
                    planPokerSlackComms.deleteEphemeral(responseURL);
                    break;
                case 'finish':
                    ItemList.remove(planPokerId);
                    const finishedResult = planPoker.finish();
                    message = planPokerMessageCreator.createVotingFinished(planPoker, finishedResult);
                    planPokerSlackComms.deleteEphemeral(responseURL);
                    break;
                case "0"  : case "1/2" : case "1"  : case "2" :
                case "3"  : case "5"   : case "8"  : case "13":
                case "20" : case "40"  : case "100": case "?" :
                case ":coffee:":
                    if(planPoker){
                        planPoker.addVote(userId, action);
                        ItemList.update(planPoker);
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