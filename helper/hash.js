const bcrypt = require('bcrypt');
const md5 = require("md5");

const hash = {};

hash.encrypt = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if(err) return reject(err);
      bcrypt.hash(password, salt, (err, hash) => {
        if(err) return reject(err);
        return resolve(hash)
      });
    });
  })
}

hash.compare = (password, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, result) => {
      if(err) return reject(err);
      return resolve(result || false);
    });
  })
}

hash.validHashGeneric = (str, hash, salt) => {
  const _hash = md5(`${salt}${str}`);
  // console.log(str, salt, _hash);
  return hash === _hash;
}

hash.generateSessionId = (userId, ts) => {
  const salt = process.env["SALT_SESSION"];
  const _hash = md5(`${salt}${userId}${ts}`);
  return _hash;
}

module.exports = hash;