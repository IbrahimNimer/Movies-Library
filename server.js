const express = require('express');
const app = express();
const PORT = 3000;


// Pages handlers
app.get('/' , homePageHandler);
app.get('/favorite' , favoriteHandler)



// Constructor function for creating movie objects
class Movie {
    constructor(title, poster_path, overview) {
        this.title = title;
        this.poster_path = poster_path;
        this.overview = overview;
    }
}

//Data from json
const dataFromJson = require('./Movie Data/data.json')

// Sample movie data
const spiderMan = new Movie(
  dataFromJson.title,
  dataFromJson.poster_path,
  dataFromJson.overview
  );


// Home page route
function homePageHandler(req,res){
  res.json(spiderMan)
}

// Favorite Page Endpoint
function favoriteHandler(req,res){
  res.send('Welcome to Favorite Page');
}


// Error handling middleware for 404 - Page Not Found
app.use((req, res, next) => {
  res.status(404).json({ status: 404, responseText: 'Page not found' });
});

// Error handling middleware for 500 - Internal Server Error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 500, responseText: 'Sorry, something went wrong' });
});


// Start the server
app.listen(PORT);