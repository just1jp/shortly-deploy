var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  var links = db.Links.find();
  res.status(200).send(links);

  // Links.reset().fetch().then(function(links) {
  //   res.status(200).send(links.models);
  // });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  db.Links.findOne({ url: uri }, function(err, link) {
    if (link) {
      res.status(200).send(link.visits);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }
        var newLink = new Link({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        });
        newLink.save();
        res.status(200).send(link);
      });
    }
  });

  // new Link({ url: uri }).fetch().then(function(found) {
  //   if (found) {
  //     res.status(200).send(found.attributes);
  //   } else {
      // util.getUrlTitle(uri, function(err, title) {
      //   if (err) {
      //     console.log('Error reading URL heading: ', err);
      //     return res.sendStatus(404);
      //   }
      //   var newLink = new Link({
      //     url: uri,
      //     title: title,
      //     baseUrl: req.headers.origin
      //   });
      //   newLink.save().then(function(newLink) {
      //     Links.add(newLink);
      //     res.status(200).send(newLink);
      //   });
      // });
  //   }
  // });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  db.User.findOne({ username: username }, function(err, user) {
    if (err) { return handleError(err); }
    if (!user) {
      console.log('No user, please sign up!');
      res.redirect('/login');
    } else {
      db.comparePassword(password, user.password, function(match) {
        if (match) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      });
    }
  });    
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  db.hashPassword(req.body.password, function(hash) {
    db.User.findOne({ username: username }, function(err, user) {
      if (err) { return handleError(err); }
      if (!user) {
        var newUser = new db.User({
          username: username,
          password: hash
        });
        newUser.save(function(err, user) {
          util.createSession(req, res, user);
        });
      } else {
        console.log('Account already exists');
        res.redirect('/signup');
      }
    });    
  });
};

exports.navToLink = function(req, res) {


  db.Link.findOne({ code: req.params[0] }, function(err, link) {
    if (!link) {
      res.redirect('/');
    } else {
      link.visits = link.visits + 1;
      link.save();
      res.redirect(link.url);
    }
  });



  // ).fetch().then(function(link) {
  //   if (!link) {
  //     res.redirect('/');
  //   } else {
  //     link.set({ visits: link.get('visits') + 1 })
  //       .save()
  //       .then(function() {
  //         return res.redirect(link.get('url'));
  //       });
  //   }
  // });
};





