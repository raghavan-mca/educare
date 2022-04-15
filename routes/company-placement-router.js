const express = require('express')
const router = express.Router()
const create_company_placement = require('../controller/placement-company/create-placement-controller')
const fetch_company_placement = require('../controller/placement-company/fetch-placement-controller')
const update_company_placement = require('../controller/placement-company/update-placement-controller')
const delete_company_placement = require('../controller/placement-company/delete-placement-controller')
const bulk_delete_compant_placement = require('../controller/placement-company/bulk-delete-placement-controller')

const {
    validate
} = require('express-validation')
const joi_validation = require('../validation/company-placement')


const create_placement = new create_company_placement()
const fetch_placement = new fetch_company_placement()
const update_placement = new update_company_placement()
const delete_placement = new delete_company_placement()
const bulk_delete_placement = new bulk_delete_compant_placement()

router.post('/educare/new-placement', validate(joi_validation.create_validation),
    create_placement.createcompanyPlacement)
router.get('/educare/view-placement', validate(joi_validation.fetch_validation),
    fetch_placement.fetchcompanyPlacement)
router.put('/educare/edit-placement/:id', validate(joi_validation.update_body_validation), validate(joi_validation.update_validation),
    update_placement.updatecompanyPlacement)
router.delete('/educare/delete-placement/:id', validate(joi_validation.delete_validation),
    delete_placement.deletecompanyPlacement)
router.delete('/educare/bulk-delete-placement', validate(joi_validation.bulk_delete_validation),
    bulk_delete_placement.bulkdeletecompanyPlacement)


module.exports = router