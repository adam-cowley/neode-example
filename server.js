/**
 * A basic example using Express to create a Rest API
 */
const express = require('express');
const neode = require('neode')
            .fromEnv()
            .with({Movie: require('./models/Movie')});

const app = express();

/**
 * Use neode.all() to return a paginated list of movies
 */
app.get('/movies', (req, res) => {
    const order_by = req.query.order || 'title';
    const sort = req.query.sort || 'ASC';
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const skip = (page-1) * limit;

    const params = {};
    const order = {[order_by]: sort};

    neode.all('Movie', params, order , limit, skip)
        .then(res => {
            // `all` returns a NodeCollection - this has a toJson method that
            // will convert all Nodes within the collection into a JSON object
            return res.toJson();
        })
        .then(json => {
            res.send(json);
        })
        .catch(e => {
            res.send(e.message)
        });
});

/**
 * Use `findById` to get a movie by it's internal Node ID
 */
app.get('/movies/~:id', (req, res) => {
    neode.findById('Movie', parseInt(req.params.id))
        .then(res => {
            return res.toJson();
        })
        .then(json => {
            res.send(json);
        })
        .catch(e => {
            res.send(e.stack)
        });
});

/**
 * Use `find` to get a moivie by it's primary key
 */
app.get('/movies/:id', (req, res) => {
    neode.find('Movie', req.params.id)
        .then(res => {
            return res.toJson();
        })
        .then(json => {
            res.send(json);
        })
        .catch(e => {
            res.send(e.stack)
        });
});

/**
 * Listen on port 3000
 */
app.listen(3000, function () {
  console.log('app listening on http://localhost:3000');
});

