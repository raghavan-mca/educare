const express = require('express')
const router = express.Router()

const fetch_company_listing = require('../controller/company-listing/fetch-company')

const {
    validate
} = require('express-validation')

const joi_validation = require('../validation/company-listing')


const fetch_company = new fetch_company_listing()

router.get('/educare/new-company', validate(joi_validation.fetch_validation),
    fetch_company.fetchcompanylisting)



module.exports = router