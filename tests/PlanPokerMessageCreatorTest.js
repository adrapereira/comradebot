var expect = require('chai').expect;
var PlanPoker = require('../models/PlanPoker');
var PlanPokerMessageCreator = require('../helpers/plan-poker/PlanPokerMessageCreator');

describe('finishPlanPoker message', function () {
    it('should not throw errors and build the correct text', function () {
        const plan = new PlanPoker("12345", "the_creator", "the_channel", "the_title", "team_id");
        // 1. ARRANGE
        plan.addVote("user1", "1");
        plan.addVote("user2", "1");
        plan.addVote("user3", "1");
        plan.addVote("user4", "1");

        // 2. ACT
        const finishResult = plan.finish();
        const message = PlanPokerMessageCreator.createVotingFinished(plan, finishResult);

        // 3. ASSERT
        expect(finishResult.max.vote).to.be.equal("1");
        expect(finishResult.max.count).to.be.equal(4);
        expect(finishResult.allSame).to.be.equal(true);

        expect(message.text).to.be.equal("the_creator started a planning poker: *the_title*");
    });
});