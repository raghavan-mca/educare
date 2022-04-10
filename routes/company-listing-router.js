const express = require('express')
const router = express.Router()

const fetch_company_listing = require('../controller/company-listing/fetch-company')
const create_company_listing = require('../controller/company-listing/create-company')
const update_company_listing = require('../controller/company-listing/update-company')
const delete_company_listing = require('../controller/company-listing/delete-company')
const bulk_delete_company_listing = require('../controller/company-listing/bulk-delete-company')
const search_company_listing = require('../controller/company-listing/search-company')

const {
    validate
} = require('express-validation')

const joi_validation = require('../validation/company-listing')


const fetch_company = new fetch_company_listing();
const create_company = new create_company_listing();
const update_company = new update_company_listing();
const delete_company = new delete_company_listing();
const bulk_delete_company = new bulk_delete_company_listing();
const search_company = new search_company_listing();

router.get('/educare/get-company', validate(joi_validation.fetch_validation),
    fetch_company.fetchcompanylisting)

router.post('/educare/new-company', validate(joi_validation.create_validation),
    create_company.createcompanylisting)

router.put('/educare/edit-company/:id', validate(joi_validation.update_body_validation), validate(joi_validation.update_params_validation),
    update_company.updatecompanylisting)

router.delete('/educare/delete-company/:id', validate(joi_validation.delete_params_validation),
    delete_company.deletecompanylisting)

router.delete('/educare/bulk-delete-company', validate(joi_validation.bulk_delete_validation),
    bulk_delete_company.bulkdeletecompanylisting)

router.get('/educare/search-company/:companyname', validate(joi_validation.search_validation),
    search_company.searchcompanylisting)

module.exports = router