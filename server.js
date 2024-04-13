const express = require('express');
const app = express();


// Constructor function for creating movie objects
class Movie {
    constructor(title, poster_path, overview) {
        this.title = title;
        this.poster_path = poster_path;
        this.overview = overview;
    }
}

// Sample movie data
const spiderMan = new Movie(
    "Spider-Man: No Way Home",
    "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    `Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero. When he asks for help from Doctor Strange the stakes become even more dangerous forcing him to discover what it truly means to be Spider-Man.`
  );


// Home page route
app.get('/', (req, res) => {
    res.json(spiderMan);
  });


  
// Favorite Page Endpoint
app.get('/favorite', (req, res) => {
  res.send('Welcome to Favorite Page');
});

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
const PORT = 3000;
app.listen(PORT);