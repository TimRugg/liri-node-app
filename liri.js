require('dotenv').config();
var keys = require('./keys.js');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require("fs");

var inputString = process.argv;
navigateToLIRI(inputString[2]); // use the first argument to decide which menu item to go to
// MENU ITEMS
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
    // if no song title was input, use The Sign else parse input together if without quotes
    var lookupSongValue = "";
    if (lookupValue()=="ErrNoLookup") {
        lookupSongValue = "the sign";   
    } else { 
        lookupSongValue = lookupValue();
    };
    // pull back and output song information
    var spotify = new Spotify(keys.spotify); // using keys.js sends the two spotify keys to create a Spotify object
    // spotify.search({type:'track', query:'Aftertaste'}, function(err, data) {
    spotify.search({type:'track', query:lookupSongValue}, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        var spotifyItems = data.tracks.items; // to simplify values in console logs
        for (var i=0; i < spotifyItems.length; i++) {
            // the API treats the search as a contains returning records the name is part of and even though track is searched
            // a record is returned if the album also matches song name
            if (spotifyItems[i].album.album_type == "album" && spotifyItems[i].name.toLowerCase() == lookupSongValue) {
            // multiple results can be found for one song - this outputs all albums    
                console.log("-------------------------------------------------------------------");
                console.log("Song: " + spotifyItems[i].name 
                        + "\nAlbum: " + spotifyItems[i].album.name 
                        + "\nPreview: " + spotifyItems[i].preview_url);
                    var spotifyArtists = "";
                    // multiple artists be named
                    for (var j=0; j < spotifyItems[i].artists.length; j++) {
                        if (j > 0) {
                             spotifyArtists += ", "; // place a comma before the next value
                        };       
                        spotifyArtists += spotifyItems[i].artists[j].name;        
                    }
                    console.log("Artist(s): " + spotifyArtists); // output all artis concatenated above
            }
        }
    });
}

function lookupValue() {
//concatenate the other process args together into one string
//a parameter can be in quotes or a string out of quotes
    var lookup = "";
    for (i = 3; i < inputString.length; i++) {
        lookup += inputString[i] + " "; 
    }
    if (lookup == "") {
        return "ErrNoLookup";
    } else {
        return lookup.trim().toLowerCase(); // remove trailing space and change to all lower case
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
