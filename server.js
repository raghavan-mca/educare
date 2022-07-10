const express = require('express');
const cors = require('cors');
const app = express();
const file_uploade = require('express-fileupload')

const mongoose = require('mongoose')


const apierrorHandler = require('./error/errorhandler')
const config = require('./configurations/config')
app.use(express.json());
app.use(cors());

const company_placement = require('./router/company-placement-router')
const company_listing = require('./router/company-listing-router')
const department = require('./router/department-router')
const batch = require('./router/batch-router')
const student = require('./router/students-router')
const report = require("./router/reports-router")

app.use(file_uploade({
    useTempFiles : true,
    createParentPath:true
}));
app.use(company_placement)
app.use(company_listing)
app.use(department)
app.use(batch)
app.use(student)
app.use(report)
app.use(apierrorHandler)

app.use((req, res, next) => {
    res.status(404).send({
        'StatusCode': 404,
        'error': 'Not found'
    })
})




console.log(config.connection);

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