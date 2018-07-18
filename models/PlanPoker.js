class PlanPoker {
    constructor(id, creator, channel, title){
        this.id = id;
        this.creator = creator;
        this.title = title;
        this.channel = channel;
        this.message_ts;
        this.manage_message_ts;
        this.votes = {};
    }

    addVote(username, value) {
        this.votes[username] = value;
    };

    reset(){
        this.votes = {};
    };

    finish() {
        let counts = {};
        let result = {};

        const voteValues = Object.keys(this.votes).map(k => this.votes[k]);
        for (let i = 0; i < voteValues.length; i++) {
            const num = voteValues[i];
            counts[num] = counts[num] ? counts[num] + 1 : 1;
        }

        const countsKeys = Object.keys(counts);
        let maxVal;
        for (let i = 0; i < countsKeys.length; i++) {
            const key = countsKeys[i];
            const val = counts[key];
            if(shouldVoteCountForStats(key)){
                // when the max value is the same as our value, we use the biggest vote
                if(!maxVal || maxVal.count < val|| (maxVal.count === val && maxVal.vote < key)){
                    maxVal = {
                        vote: key,
                        count: val
                    }
                }
            }
        }
        result.max = maxVal;
        return result;
    }
}

function shouldVoteCountForStats(vote){
    return vote !== "?";
}

module.exports = PlanPoker;