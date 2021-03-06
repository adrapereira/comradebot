const _ = require("underscore");

class DSM {
    constructor(id, creator, channel, team) {
        this._id = id;
        this.creator = creator;
        this.channel = channel;
        this.team = team;
        this.message_ts;
        this.manage_message_ts;
        this.join_ts_list = [];
        this.participants = {};
        this._duration;
        this.link;
        this.meeting = {
            startTime: null,
            participantsLeft: [],
            participantsDone: [],
            currentSpeaker: null,
            currentSpeakerStartTime: null
        }
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

    addParticipant(user) {
        this.participants[user.id] = user;
    }

    start() {
        let userIds = Object.keys(this.participants);
        _.shuffle(userIds);
        this.meeting.participantsLeft = userIds;
        this.meeting.startTime = _.now();
    }

    nextParticipant() {
        const now = _.now();
        if (this.meeting.currentSpeaker) {
            this.participants[this.meeting.currentSpeaker].time = formatTimeDifference(now, this.meeting.currentSpeakerStartTime);
            this.meeting.participantsDone.push(this.meeting.currentSpeaker);
        }
        if (this.meeting.participantsLeft.length > 0) {
            this.meeting.currentSpeaker = this.meeting.participantsLeft.pop();
            this.meeting.currentSpeakerStartTime = now;
            return true;
        } else {
            this.meeting.currentSpeaker = null;
            this.meeting.currentSpeakerStartTime = null;
        }
        return false;
    }

    mapObjectToThis(obj) {
        obj && Object.assign(this, obj);
    }
}

function formatTimeDifference(timeNow, timeEarlier) {
    let difference = timeNow - timeEarlier;
    let minutes = Math.floor(difference / 1000 / 60);
    difference -= minutes * 1000 * 60;

    let seconds = Math.floor(difference / 1000);
    seconds = (seconds < 10 ? "0" : "") + seconds;
    return minutes + ":" + seconds;
}

module.exports = DSM;
