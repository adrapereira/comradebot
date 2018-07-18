var expect = require('chai').expect;
var PlanPoker = require('../models/PlanPoker');

describe('finishPlanPoker()', function () {
    it('should check most voted is 3', function () {
        var plan = new PlanPoker();
        // 1. ARRANGE
        plan.addVote("user1", "1");
        plan.addVote("user2", "3");
        plan.addVote("user3", "3");
        plan.addVote("user4", "5");
        plan.addVote("user5", "5");
        plan.addVote("user6", "3");

        // 2. ACT
        var finishResult = plan.finish();

        // 3. ASSERT
        expect(finishResult.max.vote).to.be.equal("3");
        expect(finishResult.max.count).to.be.equal(3);
    });

    it('should check most voted is :coffee:', function () {
        var plan = new PlanPoker();
        // 1. ARRANGE
        plan.addVote("user1", "1");
        plan.addVote("user2", "3");
        plan.addVote("user3", ":coffee:");
        plan.addVote("user4", ":coffee:");
        plan.addVote("user5", "5");
        plan.addVote("user6", ":coffee:");
        plan.addVote("user7", ":coffee:");

        // 2. ACT
        var finishResult = plan.finish();

        // 3. ASSERT
        expect(finishResult.max.vote).to.be.equal(":coffee:");
        expect(finishResult.max.count).to.be.equal(4);
    });

    it('should check most voted is 5 when 3 and 5 have most votes', function () {
        var plan = new PlanPoker();
        // 1. ARRANGE
        plan.addVote("user1", "1");
        plan.addVote("user2", "3");
        plan.addVote("user3", "3");
        plan.addVote("user4", "5");
        plan.addVote("user5", "5");
        plan.addVote("user6", "3");
        plan.addVote("user7", "5");

        // 2. ACT
        var finishResult = plan.finish();

        // 3. ASSERT
        expect(finishResult.max.vote).to.be.equal("5");
        expect(finishResult.max.count).to.be.equal(3);
    });

    it('should check most voted is 5 when most votes is ?', function () {
        var plan = new PlanPoker();
        // 1. ARRANGE
        plan.addVote("user1", "1");
        plan.addVote("user2", "?");
        plan.addVote("user3", "?");
        plan.addVote("user4", "5");
        plan.addVote("user5", "5");
        plan.addVote("user6", "?");
        plan.addVote("user7", "3");

        // 2. ACT
        var finishResult = plan.finish();

        // 3. ASSERT
        expect(finishResult.max.vote).to.be.equal("5");
        expect(finishResult.max.count).to.be.equal(2);
    });
});