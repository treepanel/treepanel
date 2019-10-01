class Storage {
  static create(values, defaults) {
    const store = new Storage();
    for (const key of Object.keys(values)) {
      store.setIfNull(values[key], defaults[key]);
    }
    return store;
  }

  set(key, val, cb) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      const msg =
        'Octotree cannot save its settings. ' +
        'If the local storage for this domain is full, please clean it up and try again.';
      console.error(msg, e);
    }
    if (cb) cb();
  }

  get(key, cb) {
    var val = parse(localStorage.getItem(key));
    if (cb) cb(val);
    else return val;

    function parse(val) {
      try {
        return JSON.parse(val);
      } catch (e) {
        return val;
      }
    }
  }

  setIfNull(key, val, cb) {
    this.get(key, (existingVal) => {
      this.set(key, existingVal == null ? val : existingVal, cb);
    });
  }
}

const store = Storage.create(STORE, DEFAULTS);
window.store = store;
