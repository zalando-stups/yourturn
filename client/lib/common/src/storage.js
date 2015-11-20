// shameless copy from https://github.com/zalando/oauth2-client-js
class Storage {

    constructor(prefix) {
        this.prefix = prefix;
    }

    get(key) {
        let item = localStorage.getItem(`${this.prefix}-${key}`);
        try {
            item = JSON.parse(item);
        } catch(err) {
            return item;
        }
        return item;
    }

    set(key, val) {
        let toSave = typeof val === 'object' ? JSON.stringify(val) : val;
        return localStorage.setItem(`${this.prefix}-${key}`, toSave);
    }

    remove(key) {
        return localStorage.removeItem(`${this.prefix}-${key}`);
    }

    _empty() {
        Object
        .keys(localStorage)
        .forEach(key => {
            if (key.startsWith(this.prefix)) {
                localStorage.removeItem(key);
            }
        });
    }

    // do *NOT* call this outside of tests
    _purge() {
        localStorage.clear();
    }
}

export default new Storage('yourturn');
