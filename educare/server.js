const express = require('express');
const app = express();

const mongoose = require('mongoose')

const apierrorHandler = require('../educare/error/errorhandler')
const config = require('./configurations/config')
app.use(express.json());

const company_placement_router = require('./routes/company-placement-router')
const company_listing = require('./routes/company-listing-router')

app.use(company_placement_router)
app.use(company_listing)
app.use(apierrorHandler)

app.use((req, res, next) => {
    res.status(404).send({
        'StatusCode': 404,
        'error': 'Not found'
    })
})






mongoose.connect(config.connection).then(() => {
    console.log('db connected');
    app.listen(config.port, () => {
        console.log(`http://localhost:${config.port}`);
    })

}).catch((err) => {
console.log(err);
    console.log('error in connection');
    return err
})