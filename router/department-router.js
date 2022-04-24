const express = require('express');
const router = express.Router();


const create_department_listing = require('../controller/department/department-create');
const fetch_department_listing = require('../controller/department/department-fetch');
const edit_department_listing = require('../controller/department/department-edit');
const delete_department_listing = require('../controller/department/department-delete')




const {
    validate
} = require('express-validation');

const joi_validation = require('../validation/department');

const create_department = new create_department_listing();
const fetch_department = new fetch_department_listing();
const edit_department = new edit_department_listing();
const delete_department = new delete_department_listing();

router.post('/educare/new-department', validate(joi_validation.department_create),
    create_department.create_department_listing)

router.get('/educare/get-department', validate(joi_validation.department_fetch),
    fetch_department.fetch_department_listing)

router.put('/educare/edit-department/:id', validate(joi_validation.department_edit), validate(joi_validation.department_edit_params),
    edit_department.edit_department_listing)

router.delete('/educare/delete-department/:id', validate(joi_validation.department_delete_params),
    delete_department.delete_department_listing)






module.exports = router