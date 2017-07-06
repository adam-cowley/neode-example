const express = require('express');
const neode = require('neode').fromEnv().with({Movie: require('./models/Movie')});

const app = express();

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
            return res.toJson();
        })
        .then(json => {
            res.send(json);
        })
        .catch(e => {
            res.send(e.message)
        });
});

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

app.listen(3000, function () {
  console.log('app listening on :3000');
});

