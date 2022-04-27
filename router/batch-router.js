const express = require('express');
const router = express.Router();


const create_batch_listing = require('../controller/batch/batch-create');
const fetch_batch_listing = require('../controller/batch/batch-fetch');
const edit_batch_listing = require('../controller/batch/batch-edit');
const delete_batch_listing = require('../controller/batch/batch-delete');
const batch_mass_transfer = require('../controller/batch/mass-transfer')



const {
    validate
} = require('express-validation');

const joi_validation = require('../validation/batch');

const create_batch = new create_batch_listing();
const fetch_batch = new fetch_batch_listing();
const edit_batch = new edit_batch_listing();
const delete_batch = new delete_batch_listing();
const mass_transfer = new batch_mass_transfer()

router.post('/educare/new-batch', validate(joi_validation.batch_create),
    create_batch.create_batch_listing)

router.get('/educare/get-batch', validate(joi_validation.batch_fetch),
    fetch_batch.fetch_batch_listing)

router.put('/educare/edit-batch/:id', validate(joi_validation.batch_edit), validate(joi_validation.batch_edit_params),
    edit_batch.edit_batch_listing)

router.delete('/educare/delete-batch/:id', validate(joi_validation.batch_delete_params),
    delete_batch.delete_batch_listing)

router.put('/educare/mass-transfer/:id', validate(joi_validation.batch_mass_transfer), validate(joi_validation.batch_mass_transfer_params),
    mass_transfer.mass_transfer)


module.exports = router