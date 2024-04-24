const express = require('express');
const app = express();
const cors = require('cors')
const axios = require('axios')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
require('dotenv').config()
const port = process.env.PORT
const apiKey = process.env.API_KEY

const { Client } =  require('pg')
//postgres://username:password@localhost:5432/darabasename
// const url =`postgres://ibrahim:0000@localhost:5432/movielibrary`  firt url
const url = process.env.URL  //Cloud Url
const client = new Client(url)

// Pages handlers
app.get('/' , homePageHandler);
app.get('/favorite' , favoriteHandler)
app.get('/trending' , trendingHandler)
app.get('/search' , searchHandler)
app.get('/discover' , discoverHandler)
app.get('/popular' , popularHandler)
app.post('/addMovies' , addMovieHandler)
app.get('/allMovies', allMoviesHandler)
app.put('/editMovie/:movieId' ,editMoviesHandler)
app.delete('/DELETE/:id' , deleteMoviesHandler)
app.get('/GET/:getId' , getMoviesHandler)




// Constructor function for creating movie objects
class Movie {
    constructor(title, poster_path, overview) {
        this.title = title;
        this.poster_path = poster_path;
        this.overview = overview;
    }
}

// Constructor function for trending movie objects
class Movie2 {
  constructor(id , title , release_date , poster_path, overview) {
      this.id = id;
      this.title = title;
      this.release_date = release_date;
      this.poster_path = poster_path;
      this.overview = overview;
  }
}


//Data from json
const dataFromJson = require('./Movie Data/data.json');


// Sample movie data
const spiderMan = new Movie(
  dataFromJson.title,
  dataFromJson.poster_path,
  dataFromJson.overview
  );


// Home page function
function homePageHandler(req,res){
  res.json(spiderMan)
}

// Favorite Page function
function favoriteHandler(req,res){
  res.send('Welcome to Favorite Page');
}

// Trending Page function
function trendingHandler(req,res){
  let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}`
  axios.get(url)
  .then(result =>{
  console.log(result.data.results)
  let movieData = result.data.results.map(movie => {
      return new Movie2 (movie.id , movie.title , movie.release_date , movie.poster_path , movie.overview)
  })
  res.json(movieData)
  })
  .catch(error => {
    console.log(error)
    res.status(500).send('Internal Server Eror')
  })
}

// Search Page function
function searchHandler(req,res){
  let movieName = req.query.title 
let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${movieName}&page=2`
axios.get(url)
.then(result => {
  console.log(result.data.results)
  let response = result.data.results
  res.json(response)
})
.catch(error => {
  console.log(error)
  res.status(500).send('Internal Server Eror')
})
}

// Discover Page function
function discoverHandler(req,res){
  let url = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}`
  axios.get(url)
  .then(result =>{
    console.log(result.data.results)
    let response = result.data.results;
    res.json(response)
  })
  .catch(error => {
    console.log(error)
    res.status(500).send('Internal Server Eror')
  })
}

// Popularity Page function
function popularHandler(req,res){
  let url = `https://api.themoviedb.org/3/person/popular?api_key=${apiKey}`
  axios.get(url)
  .then(result =>{
    console.log(result.data.results)
    let response = result.data.results;
    res.json(response)
  })
  .catch(error => {
    console.log(error)
    res.status(500).send('Internal Server Eror')
  })
}

// Post Movies Function
function addMovieHandler(req, res) {
  console.log(req.body)
  const {original_title, release_date, poster_path, overview, comment }= req.body 
  const  sql = `INSERT INTO movies(original_title, release_date, poster_path, overview, comment )
  VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  const values = [original_title, release_date, poster_path, overview, comment] 
  client.query(sql, values).then((reuslt)=>{
      console.log(reuslt.rows)
      res.status(201).json(reuslt.rows)
  }).catch()
}


// ADD TO TABLE
function allMoviesHandler(req,res){
  const sql = `SELECT * FROM movies;`
  client.query(sql).then((reuslt)=>{
      const data = reuslt.rows
      res.json(data)

  })
  .catch()

}

// Edit Moives Function
function editMoviesHandler(req, res){
  
  let id = req.params.movieId;
  
  let {original_title, release_date, poster_path, overview, comment} = req.body;
  let sql = `UPDATE movies
  SET original_title = $1, release_date = $2, poster_path = $3, overview = $4, comment = $5
  WHERE id = $6;`;
  let values = [original_title, release_date, poster_path, overview, comment, id];
  client.query(sql, values).then(result=>{
      res.send("successfuly updated")

  }).catch()

}

function deleteMoviesHandler(req,res){
    console.log(req.params)
    let id = req.params.id;
    let sql=`DELETE FROM movies WHERE id = $1 ;`;
    let values = [id];
    client.query(sql, values).then(result=>{
        res.status(204).send("successfuly deleted")
    }).catch()
}


// Get Movies Functio
function getMoviesHandler(req,res){
  console.log(req.params)
  let id = req.params.getId;
  let sql=`SELECT * FROM movies WHERE id = $1 ;`;
  let values = [id];
  client.query(sql, values).then(result=>{
      const data = result.rows
      res.json(data)
  }).catch()
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


// Listener 
client.connect()
.then(()=>{
  app.listen(port, ()=>{
  console.log(`listening to port ${port}`);
  })
})
.catch()