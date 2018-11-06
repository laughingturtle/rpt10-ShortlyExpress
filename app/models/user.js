var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var Link = require('./link');

const saltRounds = 10;
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';

var User = db.Model.extend({
  tableName: 'users',
  hasTimeStamps: true,
  link: function() {
    return this.belongsTo(Link, 'userId');
  },
  // initialize? hash and salt here
  // what's the var for our password to pass in below?
  initialize: function() {
    this.on('creating', function(model, attrs, options) {
      bcrypt.hash(myPlaintextPassword, saltRounds).then(function(hash) {
        console.log('our wonderful hash: ', hash);
        // model.set('password', hash)
        // Store hash in your password DB.
      });
    });
  }
});

module.exports = User;