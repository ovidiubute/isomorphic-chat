require("regenerator-runtime/runtime");
require("babel-register");

const nano = require("nano")("http://couchdb:5984");

/**
 * Ensure DB is created
 * @param {String} name DB name
 */
async function ensureDatabase(name) {
  await new Promise((resolve, reject) => {
    return nano.db.list((err, body) => {
      if (err) {
        return reject(err);
      }

      if (body.includes(name)) {
        return resolve(nano.db.use(name));
      }

      return nano.db.create(name, err2 => {
        if (!err2) {
          return resolve(nano.db.use(name));
        }

        return reject(err2);
      });
    });
  });
}

// Start backend
ensureDatabase("ic-messages").then(() => require("./app"));
