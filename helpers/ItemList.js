const PouchDB = require('pouchdb');
const db = new PouchDB('cache-db');

class ItemList {
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
        db.get(id).then(function (doc) {
            if (doc) {
                return db.remove(doc);
            }
        });
    }
}

const instance = new ItemList();
Object.freeze(instance);

module.exports = instance;