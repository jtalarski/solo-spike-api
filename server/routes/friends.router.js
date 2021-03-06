const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');

router.get('/',rejectUnauthenticated, (req, res) => {
  console.log('Get Friends Queue Router');
  let queryText = `SELECT * FROM "movie" JOIN "friend_movie" ON "friend_movie"."movie_id" = "movie"."movie_table_id" ORDER BY "movie"."title";`;
  let secondQueryText = `SELECT "movie"."movie_table_id" FROM "movie" JOIN "friend_movie" ON "friend_movie"."movie_id" = "movie"."movie_table_id" WHERE "friend_movie"."friend_id" = $1;`;
  pool.query(queryText)
  .then(friendMovies => {
    pool.query(secondQueryText, [req.user.id])
  .then(myMovies => {
    console.log('myMovies results', myMovies.rows)
    
    let myMovieIds = myMovies.rows.map(movie => movie.movie_table_id);
    let recommendations = friendMovies.rows.filter(movie => {
      let haveInQueue = myMovieIds.includes(movie.movie_table_id)
    return !haveInQueue});
    res.send(recommendations)
  }).catch(err => {
    console.error('failed recommendations', err);
    res.sendStatus(500);
  });
  });
})







/**
 * POST route template
 */
router.post('/',rejectUnauthenticated, (req, res) => {
  console.log('Add Rec POST router got a hit', req.body);
  const queryText = `INSERT INTO "friend_movie" ("friend_id", "movie_id")
  VALUES ($1, $2)`
  pool.query(queryText, [req.user.id, req.body.id])
  .then(result => {
    res.sendStatus(201);
  }).catch(err => {
    console.error('Failed in create media', err);
    res.sendStatus(500);
  });
});




module.exports = router;