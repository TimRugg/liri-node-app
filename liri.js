require('dotenv').config();
var keys = require('./keys.js');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require("fs");

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
console.log("spotify-this-song");
    // if no song title was input, use The Sign else parse input together if without quotes
    var lookupSongValue = "";
    if (lookupValue()=="ErrNoLookup") {
        lookupSongValue = "The Sign";   
    } else { 
        lookupSongValue = lookupValue();
    };
    // pull back and output song information
    var spotify = new Spotify(keys.spotify); // using keys.js sends the two spotify keys to create a Spotify object
    spotify.search({type:'track', query:'Aftertaste'}, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
//Save all arrays to variables
//Loop through for albums
//Loop through for artists on album
//output Song - Artist(s) - Album - Preview URL 
        // var songData = JSON.stringify(data);
        console.log("--------------------------------------------ITEMS");
        console.log(data.tracks.items[0].name);
        console.log(data.tracks.items[0].preview_url);
        console.log("--------------------------------------------ALBUM");
        console.log(data.tracks.items[0].album.album_type);
        console.log(data.tracks.items[0].album.name);
        console.log("--------------------------------------------ARTISTS");
        console.log(data.tracks.items[0].artists[0].name);
        // console.log(data.tracks.items);
        // console.log("Artist(s): " + artist);
        // console.log("Song: " + song);
        // console.log("Preview: " + preview);
        // console.log("Album: " + album);       
    });
}

function lookupValue() {
//concatenate the other process args together into one string
    var lookup = "";
    for (i = 3; i < inputString.length; i++) {
        lookup += inputString[i] + " "; 
    }
    if (lookup == "") {
        return "ErrNoLookup";
    } else {
        return lookup.trim(); // remove trailing space
    }   
}

function getMovie() {
    // if no movie title was input, use Mr. Nobody else parse input together if without quotes
    var lookupMovieValue = "";
    if (lookupValue()=="ErrNoLookup") {
        lookupMovieValue = "Mr. Nobody";   
    } else { 
        lookupMovieValue = lookupValue();
    };
    // pull back and output movie information
    var lookupMovie = "http://www.omdbapi.com/?t=" + lookupMovieValue + "&y=&plot=short&apikey=trilogy";
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
