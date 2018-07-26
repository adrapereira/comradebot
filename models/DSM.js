class DSM {
    constructor(id, creator, channel, team) {
        this._id = id;
        this.creator = creator;
        this.channel = channel;
        this.team = team;
        this.message_ts;
        this.manage_message_ts;
        this.participants = {};
        this.duration;
        this.link;
    }

    mapObjectToThis(obj) {
        obj && Object.assign(this, obj);
    }

}

module.exports = DSM;