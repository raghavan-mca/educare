const express = require('express')
const router = express.Router()
const {
    validate
} = require('express-validation')

const joi_validation = require('../validation/report');

const create_report = require('../controller/reports/create');
const fetch_report = require('../controller/reports/fetch');

const create = new create_report()
const fetch = new fetch_report()

router.post('/educare/new-report', validate(joi_validation.report_create),
    create.createReport)
router.get('/educare/get-report', validate(joi_validation.report_fetch),
    fetch.fetchReport)

module.exports = router