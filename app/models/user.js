var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var Link = require('./link');

var User = db.Model.extend({
  tableName: 'users',
  hasTimeStamps: true,
  link: function() {
    return this.belongsTo(Link, 'userId');
  },
  hashPassword: function() {
    const saltRounds = bcrypt.genSaltSync(10);
    let crypt = Promise.promisify(bcrypt.hash);
    return crypt(model.password, saltRounds, null).then(function(hash) {
      model.set('password', hash);
    });
  },
  checkPassword: function(passwordAttempt, found) {
    let crypt = Promise.promisify(bcrypt.compare);
    return crypt(passwordAttempt, found, null).then(function(result) {
      //model.set('password', result);
      console.log(result);
    });
  },
  initialize: function() {
    this.on('creating', this.hashPassword);
  }
});

module.exports = User;