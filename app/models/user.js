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

  },
  initialize: function() {
    const saltRounds = bcrypt.genSaltSync(10);
    this.on('creating', function(model, attrs, options) {
      let crypt = Promise.promisify(bcrypt.hash);
      return crypt(model.password, saltRounds, null).then(function(hash) {
        model.set('password', hash);
      });
    });
  }
});

module.exports = User;