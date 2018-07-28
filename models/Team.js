class Team {
    constructor(id, name, token){
        this.id = id;
        this.name = name;
        this.token = token;
        this.settings = {};
    }

    mapObjectToThis(obj) {
        obj && Object.assign(this, obj);
    }
}

module.exports = Team;