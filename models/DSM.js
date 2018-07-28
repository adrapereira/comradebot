class DSM {
    constructor(id, creator, channel, team) {
        this._id = id;
        this.creator = creator;
        this.channel = channel;
        this.team = team;
        this.message_ts;
        this.manage_message_ts;
        this.participants = {};
        this._duration;
        this.link;
    }

    get duration() {
        if (this._duration) {
            return this._duration;
        }
        if (this.team.settings.dsmDuration) {
            return this.team.settings.dsmDuration;
        }
        return "15";
    }

    set duration(dur) {
        this._duration = dur;
    }

    mapObjectToThis(obj) {
        obj && Object.assign(this, obj);
    }

}

module.exports = DSM;