var express = require('express');
var util = require('./lib/utility');
var partials = require('express-partials');
var bodyParser = require('body-parser');

var db = require('./app/config');
var Users = require('./app/collections/users');
var User = require('./app/models/user');
var Links = require('./app/collections/links');
var Link = require('./app/models/link');
var Click = require('./app/models/click');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
// Parse JSON (uniform resource locators)
app.use(bodyParser.json());
// Parse forms (signup/login)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


app.get('/',
  function(req, res) {
    res.render('index');
  });

app.get('/create',
  function(req, res) {
    res.render('index');
  });

app.get('/links',
  function(req, res) {
    Links.reset().fetch().then(function(links) {
      res.status(200).send(links.models);
    });
  });

app.post('/links',
  function(req, res) {
    var uri = req.body.url;

    if (!util.isValidUrl(uri)) {
      console.log('Not a valid url: ', uri);
      return res.sendStatus(404);
    }

    new Link({ url: uri }).fetch().then(function(found) {
      if (found) {
        res.status(200).send(found.attributes);
      } else {
        util.getUrlTitle(uri, function(err, title) {
          if (err) {
            console.log('Error reading URL heading: ', err);
            return res.sendStatus(404);
          }

          Links.create({
            url: uri,
            title: title,
            baseUrl: req.headers.origin
          })
            .then(function(newLink) {
              res.status(200).send(newLink);
            });
        });
      }
    });
  });

/************************************************************/
// Write your authentication routes here
/************************************************************/

app.get('/login',
  function(req, res) {
    res.render('login');
  }
);

app.get('/signup',
  function(req, res) {
    res.render('signup');
  }
);

app.post('/signup',
  function(req, res) {
    //console.log('req: ', req.body);
    var pass = req.body.password;
    var usr = req.body.username;
    new User({username: usr, password: pass}).fetch().then(function(found) {
      if (found) {
        res.status(200).send(found.attributes);
      } else {
        Users.create({
          username: usr,
          password: pass
        })
          .then(function(success) {
            res.status(200).redirect('index');
          });
      }
    });
  }
);

app.post('/login',
  function(req, res) {
    var pass = req.body.password;
    var usr = req.body.username;
    new User({username: usr, password: pass}).fetch().then(function(found) {
      if (found) {
        console.log('db hash: ', found);
        this.checkPassword({password: pass}, found);
        res.status(200).send(found.attributes); ///move to the then block below
        console.log('--------> found.attributes: ', found.attributes);
      }
    })
      .then(function(success) {
        res.status(200).redirect('index');
      });
  }
);

/************************************************************/
// Handle the wildcard route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get('/*', function(req, res) {
  new Link({ code: req.params[0] }).fetch().then(function(link) {
    if (!link) {
      res.redirect('/');
    } else {
      var click = new Click({
        linkId: link.get('id')
      });

      click.save().then(function() {
        link.set('visits', link.get('visits') + 1);
        link.save().then(function() {
          return res.redirect(link.get('url'));
        });
      });
    }
  });
});

module.exports = app;
