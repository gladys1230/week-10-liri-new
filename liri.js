var request = require("request");
var fs = require("fs");
var keys = require("./keys.js");
var myTwitter = require("twitter");
var spotifyThisSong = require("spotify");
var userInputOne = process.argv[2];
var twitterKeys = keys.twitterKeys;
var userInputTwo = process.argv[3];


//ran into a problem that userInputTwo for songs or movies that have more than 1 word, so we need to add more progress.argv[]s
if (process.argv.length === 5) {
    //Gimme Chocolate
    userInputTwo = process.argv[3] + " " + process.argv[4];
}
if (process.argv.length === 6) {
    //she loves you
    userInputTwo = process.argv[3] + " " + process.argv[4] + " " + process.argv[5];
}
if (process.argv.length === 7) {
    //Pei Ni Dao Shu, by Leslie Cheung(famous singer in Hong Kong) & spotify pulls it out, GREAT!!!
    userInputTwo = process.argv[3] + " " + process.argv[4] + " " + process.argv[5] + " " + process.argv[6];
}
if (process.argv.length === 8) {
    //just the way you are
    userInputTwo = process.argv[3] + " " + process.argv[4] + " " + process.argv[5] + " " + process.argv[6] + " " + process.argv[7];
}
if (process.argv.length === 9) {
    //Me and My Cello (Happy Together)
    userInputTwo = process.argv[3] + " " + process.argv[4] + " " + process.argv[5] + " " + process.argv[6] + " " + process.argv[7] + " " + process.argv[8];
}

//Bonus, add the output to the log.txt file for tracking WOW HOO!!!
fs.appendFile("log.txt", ", " + userInputOne + " " + userInputTwo);

switch (userInputOne) {
    case "myTwitter":
        twitterFunction();
        break;
    case "spotifyThisSong":
        spotifyFunction();
        break;
    case "movieThis":
        movieThisFunction();
        break;
    case "doWhatItSays":
        doWhatItSaysFunction();
        break;
    default:
        console.log("Enter 'myTwitter', 'spotifyThisSong', 'movieThis', or 'doWhatItSays'");
}

function twitterFunction() {
    var client = new myTwitter(twitterKeys);
    client.get("statuses/user_timeline", { count: 20 }, function(error, tweets, response) {
        if (!error) {
            tweets.forEach(function(tweet) {
                console.log("\n***********************************");
                console.log(tweet.text);
                console.log(tweet.created_at);
                console.log("************************************\n");
            });
        }
    })
};

function spotifyFunction() {
    spotifyThisSong.search({ type: "track", query: userInputTwo }, function(error, data) {
        if (!error) {
            if (data.tracks.items.length > 0) {
                console.log("\n***********************************");
                console.log("Artist: " + data.tracks.items[0].artists[0].name);
                console.log("Song: " + data.tracks.items[0].name);
                console.log("Link: " + data.tracks.items[0].external_urls.spotify);
                console.log("Album: " + data.tracks.items[0].album.name);
                console.log("***********************************\n");
            } else {
                //if no song found by the userInputTwo, result is defaulted to "The Sign" by Ace of Base
                console.log("Hey, I can't find the song so, you get 'The Sign' by 'Ace of Base'");
                spotifyThisSong.search({ type: "track", query: "The Sign" }, function(error, data) {
                    if (!error) {

                        console.log("\n***********************************");
                        console.log("Artist: " + data.tracks.items[0].artists[0].name);
                        console.log("Song: " + data.tracks.items[0].name);
                        console.log("Link: " + data.tracks.items[0].external_urls.spotify);
                        console.log("Album: " + data.tracks.items[0].album.name);
                        console.log("***********************************\n");
                    }
                })
            }
        };
    })
};

function movieThisFunction() {
    //request
    request("http://www.omdbapi.com/?t=" + userInputTwo + "&plot=short&r=json &tomatoes=true", function(error, response, body) {
        var movie = JSON.parse(body);
        if (!error && response.statusCode === 200) {
            console.log("\n****************************\nWe are searching the movie: " + userInputTwo + " from OMDB database");
            console.log("Title: " + movie.Title);
            console.log("Year released: " + movie.Year);
            console.log("IMDB Rating: " + movie.imdbRating);
            console.log("Country: " + movie.Country);
            console.log("Language of the move: " + movie.Language);
            console.log("Plot of the movie: " + movie.Plot);
            console.log("Actors/Actresses: " + movie.Actors);
            console.log("Rotten tomatoes: " + movie.tomatoRotten);
            console.log("Rotten tomatoes URL: " + movie.tomatoURL);
            console.log("***********************************\n");
        } 
        //this part doesn't work for some reason
        else {
            console.log("Hey, I can't find what you looking for, here is Mr.NoBody");
            request("http://www.omdbapi.com/?t=" + "Mr.NoBody"  + "&plot=short&r=json &tomatoes=true", function(error, response, body) {
                var movie = JSON.parse(body);
                if (!error && response.statusCode === 200) {
                    console.log("\n****************************\nWe are searching the movie: " + userInputTwo + " from OMDB database");
                    console.log("Title: " + movie.Title);
                    console.log("Year released: " + movie.Year);
                    console.log("IMDB Rating: " + movie.imdbRating);
                    console.log("Country: " + movie.Country);
                    console.log("Language of the move: " + movie.Language);
                    console.log("Plot of the movie: " + movie.Plot);
                    console.log("Actors/Actresses: " + movie.Actors);
                    console.log("Rotten tomatoes: " + movie.tomatoRotten);
                    console.log("Rotten tomatoes URL: " + movie.tomatoURL);
                    console.log("***********************************\n");

                }
            });
        }
    });
};

function doWhatItSaysFunction() {
    //read the random.txt tile
    fs.readFile("random.txt", "utf8", function(error, contents) {
        //split it with ,
        var newContents = contents.split(",");
        var inputOne = newContents[0];
        var inputTwo = newContents[1];
        userInputOne = inputOne;
        userInputTwo = inputTwo;

        if (inputOne === "myTwitter") {
            twitterFunction();
        } else if (inputOne === "spotifyThisSong") {
            spotifyFunction();
        } else if (inputOne === "movieThis") {
            movieThisFunction();
        }

    })

};
