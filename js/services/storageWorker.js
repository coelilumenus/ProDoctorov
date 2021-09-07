export default class StorageWorker {
    constructor(storageKey) {
        this.key = storageKey;
    }
    
    getKeys() {
        if (localStorage.getItem(this.key)) {
            return localStorage.getItem(this.key).split(',');
        }
    }

    addItem (itemId, args) {
        if (!localStorage.getItem(this.key)) {
            localStorage.setItem(this.key, itemId);
            localStorage.setItem(itemId, args);
        } else {
            const oldKeys = localStorage.getItem(this.key).split(',');
            const newKeys = oldKeys.concat(itemId);
            localStorage.setItem(this.key, newKeys);
            localStorage.setItem(itemId, args);
        }
    }

    deleteItem (itemId) {
        const oldKeys = localStorage.getItem(this.key).split(',');
        if (oldKeys.indexOf(itemId) !== -1) {
            const newKeys = oldKeys.filter(item => item !== itemId);
            localStorage.setItem(this.key, newKeys);
            localStorage.removeItem(itemId);
        }
    }
}