class PlanPokerList {
    constructor(){
        this._list = {};
    }

    add(item){
        this._list[item.id] = item;
    }

    get(id){
        return this._list[id];
    }

    remove(id){
        delete this._list[id];
    }
}

const instance = new PlanPokerList();
Object.freeze(instance);

module.exports = instance;