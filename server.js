/**
 * A basic example using Express to create a simple movie recommendation engine.
 */
const express = require('express');
const session = require('express-session');
const path = require('path');

/**
 * Load Neode with the variables stored in `.env` and tell neode to
 * look for models in the ./models directory.
 */
const neode = require('neode')
    .fromEnv()
    .withDirectory(path.join(__dirname, 'models'));

/**
 * Create a new Express instance
 */
const app = express();

/**
 * Tell express to use jade as the view engine and to look for views
 * inside the ./views folder
 */
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, '/views'));

/**
 * SCRF for AJAX requests used in /recommend/:genre
 */
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

/**
 * Set up a simple Session
 */
app.use(session({
    genid: function() {
        return require('uuid').v4();
    },
    secret: 'neoderocks'
}));

/**
 * Serve anything inside the ./public folder as a static resource
 */
app.use(express.static('public'));

/**
 * Helper function to get a random movie to rate based on the name of
 * the genre
 *
 * @param  {String} genre   Name of the genre to find a movie from
 * @param  {Array}  rated   ID's of already recommended movies
 * @return {Promise}        Resolves to an object with `genre` and `rated` Node instances
 */
function getNextMovie(genre, rated) {
    let params = {
        genre,
        rated
    };

    const ignore_condition = rated.length ? 'AND NOT id(m) IN {rated}' : '';
    const cypher = `
        MATCH (g:Genre)<-[:IN_GENRE]-(m:Movie)
        WHERE g.name = {genre}
        ${ignore_condition}
        RETURN g, m
        ORDER BY RAND() LIMIT 1
    `;

    return neode.cypher(cypher, params)
        .then(res => {
            return {
                genre: neode.hydrateFirst(res, 'g'),
                movie: neode.hydrateFirst(res, 'm')
            };
        });
}

/**
 * Display home page with a list of Genres
 */
app.get('/', (req, res) => {
    neode.all('Genre')
        .then(genres => {
            res.render('index', {genres});
        });
});

/**
 * Load up the initial recommendation screen with the first movie ready to rate.
 * The subsequent ratings will use the /recommendations/:genre/next ajax call to
 * get a movie that the user hasn't rated before
 */
app.get('/recommend/:genre', (req, res) => {
    getNextMovie(req.params.genre, [])
        .then(({genre, movie}) => {
            // If there are no records, redirect to recommendation page
            if ( !genre || !movie ) {
                return res.redirect('/');
            }

            res.render('vote', {
                title: genre.get('name') + ' Recommendations',
                genre,
                movie
            });
        })
        .catch(e => {
            res.status(500).send(e.getMessage());
        });
});

/**
 * Return a new movie to rate in the supplied genre, ignoring the
 * movies that have already been rated
 */
app.get('/recommend/:genre/next', (req, res) => {
    const rated = req.query.rated ? req.query.rated.split(',') : [];

    getNextMovie(req.params.genre, rated)
        .then(({movie}) => {
            return movie.toJson();
        })
        .then(json => {
            res.send(json);
        })
        .catch(e => {
            res.status(500).send(e.getMessage());
        });
});

/**
 * Provided a map of results in the query string, create a set of rated relationships
 * and then run a query to recommend a film.
 *
 * In reality, you'd be better off installing bodyparser and taking this ingesting
 * as a post body.
 */
app.get('/recommend/:genre/results', (req, res) => {
    const query = `
        MATCH (g:Genre) WHERE g.name = {genre}
        MERGE (u:User {user_id: {user_id}})
        WITH g, u

        UNWIND keys({ratings}) AS movie
        MATCH (m) WHERE id(m) = toInt(movie)
        MERGE (u)-[r:RATED]->(m)
        SET r.rating = {ratings}[movie]

        WITH DISTINCT g, u

        MATCH (u)-[r1:RATED]->()<-[r2:RATED]-(other)
        WITH g, u, other, count(*) as in_common
        ORDER BY in_common DESC LIMIT 10

        MATCH (other)-[:RATED]->(recommendation)-[:IN_GENRE]->(g)
        WHERE NOT (u)-[:RATED]->(recommendation)

        RETURN g, recommendation, count(*) as occurrences
        ORDER BY occurrences DESC LIMIT 1
    `;

    const params = {
        genre: req.params.genre,
        user_id: req.sessionID,
        ratings: JSON.parse(req.query.ratings)
    };

    neode.cypher(query, params)
        .then(results => {
            const genre = neode.hydrateFirst(results, 'g');
            const movie = neode.hydrateFirst(results, 'recommendation');

            res.render('recommendation', {
                title: "We recommend " + movie.get("title"),
                genre,
                movie
            });
        })
        .catch(e => {
            res.status(500).send(e.getMessage());
        });
});

/**
 * For examples of how to use Neode to quickly generate a REST API,
 * checkout the route examples in ./routes.api.js
 */
app.use(require('./routes/api')(neode));

/**
 * Listen for requests on port 3000
 */
app.listen(3000, function () {
    console.log('app listening on http://localhost:3000'); // eslint-disable-line no-console
});
