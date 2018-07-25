const PouchDB = require('pouchdb');
const db = new PouchDB('plan-poker-db');

class PlanPokerList {
    constructor(){
        this._list = {};
    }

    add(item){
        this._list[item._id] = item;
        db.put(item).then().catch(console.log);
    }

    // serves as an alias to improve code readability
    update(item){
        this.add(item);
    }

    get(id){
        const item = this._list[id];
        if(item){
            return Promise.resolve(item);
        }else{
            return db.get(id);
        }
    }

    remove(id){
        delete this._list[id];
    }
}

const instance = new PlanPokerList();
Object.freeze(instance);

module.exports = instance;