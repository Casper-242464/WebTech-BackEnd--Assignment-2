const express = require('express');
const router = express.Router();


router
    .route('/api/weather')
        .get((req, res) => {
            res.render('index');
        })
        .post((req, res) => {
            
        });

router
    .route('/api/weather/:city')
        .get((req, res) => {

        })
        .put((req, res) => {

        })
        .delete((req, res) => {

        });

module.exports = router;