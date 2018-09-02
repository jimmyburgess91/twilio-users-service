const assert = require('assert');
const request = require('request');

const usersUrl = 'http://localhost:8005/users';
const playsUrl = 'http://localhost:8001/plays';
const friendsUrl = 'http://localhost:8000/friends';

let users = [];
let plays = [];


function getUsers() {
  return new Promise(function(resolve, reject) {
    request(usersUrl, { json: true }, (err, res, body) => {
      resolve(body.users);
     });
   });
}

function getPlays() {
  return new Promise(function(resolve, reject) {
    request(playsUrl, { json: true }, (err, res, body) => {
      resolve(body.users);
     });
   });
}


function testNoMissedUsers() {
  assert.equal(users.length, plays.length);
}

function testCorrectPlays() {
  let user = users[0];

  return new Promise(resolve => {
    request(playsUrl + '/' + user.username, { json: true }, (err, res, body) => {
      resolve(body.plays.length);
    })}).then(value => {
      assert.equal(user.plays, value);
  });
}

function testCorrectFriends() {
  let user = users[0];

  return new Promise(resolve => {
    request(friendsUrl + '/' + user.username, { json: true }, (err, res, body) => {
      resolve(body.friends.length);
    })}).then(value => {
      assert.equal(user.friends, value);
  });
}

Promise.all([getUsers(), getPlays()]).then((values) => {
  users = values[0];
  plays = values[1];
  testNoMissedUsers();
  testCorrectPlays();
  testCorrectFriends();
});
