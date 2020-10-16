const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */
router.get('/', (req, res) => {
  console.log('Get Queue Router');
  const queryText = `SELECT "user"."id", "movie"."title", "friend_movie"."status", "friend_movie"."fm_table_id" FROM "user"
  JOIN "friend_movie"
  ON "user"."id" = "friend_movie"."friend_id"
  JOIN "movie"
  ON "friend_movie"."movie_id" = "movie"."movie_table_id"
  WHERE "user"."id" = 1;`;
  pool.query(queryText)
  .then((result) => { res.send(result.rows); 
  }).catch((err) => {
  console.error('ERROR IN GET/ queue', err);
  res.sendStatus(500);
  })
});

/**
 * POST route template
 */
router.post('/', (req, res) => {
  // POST route code here
});

module.exports = router;
