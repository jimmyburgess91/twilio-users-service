const request = require('request');
const express = require('express');
const app = express();

const baseUrl = 'http://localhost:';
const playsUrl = baseUrl  + '8001/plays';
const friendsUrl = baseUrl + '8000/friends';

app.get('/users', function(req, res){
  request(playsUrl, { json: true }, (err, response, body) => {
     let users = [];
     let promises = [];
     for (let playUser of body.users) {
       let user = {
         username: playUser.username,
         plays: 0,
         friends: 0,
         uri: '/users/' + playUser.username
       };
       users.push(user);
       promises.push(getPlays(user));
       promises.push(getFriends(user));
    }
    Promise.all(promises).then(() => {
      res.setHeader('Content-Type', 'application/json');
      res.send({users: users, uri: '/users'});
    });
  });
});


app.get('/users/:userName', function(req, res){
  let user = {
    username: req.params.userName,
    plays: 0,
    friends: 0,
    uri: '/users/' + req.params.userName
  };
  Promise.all([getPlays(user, true), getFriends(user)]).then(() => {
    res.setHeader('Content-Type', 'application/json');
    res.send(user);
  }).catch(() => {
    res.status(404).send('Not found');
  });
});

function getPlays(user, tracks = false) {
   return new Promise(function(resolve, reject) {
     request(playsUrl + '/' + user.username, { json: true }, (err, res, body) => {
       if (res.statusCode != 200) { return reject(); }
       user.plays = body.plays.length;
       if (tracks) { user.tracks = new Set(body.plays).size }
       resolve();
     });
    });
}

function getFriends(user) {
   return new Promise(function(resolve, reject) {
     request(friendsUrl + '/' + user.username, { json: true }, (err, res, body) => {
       if (res.statusCode != 200) { return reject(); }
       user.friends = body.friends.length;
       resolve();
      });
    });
}

app.listen(8005);
