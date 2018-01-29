require('dotenv').config();
var keys = require('./keys.js');
var request = require('request');
var Twitter = require('twitter');
var fs = require("fs");

// var Spotify = require('node-spotify-api');
// var spotify = new Spotify(keys.spotify);

var inputString = process.argv;

navigateToLIRI(inputString[2]);

function navigateToLIRI(action) {
    switch (action) {
        case "my-tweets":
        getTweets();
        break;

        case "spotify-this-song":
        getSong();
        break;

        case "movie-this":
        getMovie();
        break;

        case "do-what-it-says":
        getAction();
        break;
    }
}

function getTweets(){ 
    var client = new Twitter(keys.twitter);  // using keys.js sends all four keys to create a Twitter object
    var params = {screen_name: 'ruggt001', count: 20};
    client.get('statuses/user_timeline', params, function(error, tweets, response) 
        {
            if (!error) {
                // console.log(tweets);
                for(var i = 0; i < tweets.length; i++) {
                    var j = i + 1;
                    var tweetOutput = "user: " + 
                            tweets[i].user.screen_name + "\ntweet " + j + ": " + 
                            tweets[i].text + "\ndate: " + 
                            tweets[i].created_at;
                    console.log(tweetOutput);
                }
            }
        });
}

function getSong() {
// need to get keys and figure out api
    console.log("spotify-this-song");
}

function lookupValue() {
//concatenate the other process args together into one string
    var lookup = "";
    for (i = 3; i < inputString.length; i++) {
        lookup += inputString[i] + " "; 
    }
    return lookup.trim(); // remove trailing space   
}

function getMovie() {
    // if no movie title was input, use Mr. Nobody
    if (inputString.length != 3) {
        lookupMovieValue = lookupValue();
    } else { 
        lookupMovieValue = "Mr. Nobody";
    }
    // pull back movie information
    var lookupMovie = "http://www.omdbapi.com/?t=" + lookupMovieValue + "&y=&plot=short&apikey=trilogy";
    // &r=json
    request(lookupMovie, function(error, response, body) {
    // If the request was successful...
        if (!error && response.statusCode === 200) {
            // the parse string into object
            var movieBody = JSON.parse(body);
            console.log("Title: " + movieBody.Title
                + "\nYear: " + movieBody.Year
                + "\nIMDB Rating: " + movieBody.imdbRating
                + "\n" + movieBody.Ratings[1].Source + " Rating: " + movieBody.Ratings[1].Value
                + "\nCountry: " + movieBody.Country
                + "\nLanguage: " + movieBody.Language
                + "\nPlot: " + movieBody.Plot
                + "\nActors: " + movieBody.Actors);
        }
    });
}

function getAction() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        console.log(data);
        inputString = data.split(","); // replace process.arg inputString with values in file
        inputString.unshift("0","1");  // prepend two dummy values to match expected inputString
        if (inputString[2] != "do-what-it-says") {
            navigateToLIRI(inputString[2]);
        } else {
            console.log("Error. File value cannot call 'do-what-it-says'.")
        }
    });
}
