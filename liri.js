require('dotenv').config();
var keys = require('./keys.js');
var request = require('request');

// var Spotify = require('node-spotify-api');
// var spotify = new Spotify(keys.spotify);

var Twitter = require('twitter');
var client = new Twitter(keys.twitter);  // using keys.js sends all four keys to create a Twitter object

var params = {screen_name: 'ruggt001'};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    console.log(tweets);
    // console.log(response);
  }
});

request("http://www.omdbapi.com/?t=remember+the+titans&y=&plot=short&apikey=trilogy", function(error, response, body) {

  // If the request was successful...
  if (!error && response.statusCode === 200) {

    // Then log the body from the site!
    console.log(body);
  }
});
