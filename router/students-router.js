const express = require('express');
const router = express.Router();


const create_students_listing = require('../controller/students/student-create');
const fetch_students_listing = require('../controller/students/student-fetch');
const sort_students_listing = require('../controller/students/student-sort');
const edit_students_listing = require('../controller/students/student-edit');
const delete_students_listing = require('../controller/students/student-delete');
const bulk_delete_students_listing = require('../controller/students/student-bulk-delete');
const students_transfer = require('../controller/students/student-transfer');
const students_file_uplode = require('../controller/students/student-file-uplode');
const students_search_with_placement_id = require('../controller/students/student-search-with-company-id')
const multi_api_fetch = require("../controller/students/multi-api-fetch")
const students_fetch = require("../controller/students/all-student-fetch")



const {
    validate
} = require('express-validation');

const joi_validation = require('../validation/students');

const create_students = new create_students_listing();
const fetch_students = new fetch_students_listing();
const sort_students = new sort_students_listing();
const edit_students = new edit_students_listing();
const delete_students = new delete_students_listing();
const bulk_delete_students = new bulk_delete_students_listing();
const student_transfer = new students_transfer();
const file_uploade = new students_file_uplode();
const search_with_placement_id = new students_search_with_placement_id();
const multi_apis_fetch = new multi_api_fetch()
const students_direct_fetch = new students_fetch()

router.post('/educare/new-student', validate(joi_validation.students_create),
    create_students.create_students_listing)

router.get('/educare/get-student', validate(joi_validation.students_fetch),
    fetch_students.fetch_students_listing)

router.get('/educare/search-student', validate(joi_validation.students_search_query),
    search_with_placement_id.search_with_placement_id)

router.get('/educare/sort-student', validate(joi_validation.students_sort),
    sort_students.sort_students_listing)

router.put('/educare/edit-student/:id/:student_id', validate(joi_validation.students_edit), validate(joi_validation.students_edit_params),
    edit_students.edit_students_listing)

router.delete('/educare/delete-student/:id/:student_id', validate(joi_validation.students_delete_params),
    delete_students.delete_students_listing)

router.delete('/educare/multi-delete-student/:id', validate(joi_validation.students_bulk_delete_params), validate(joi_validation.students_bulk_delete_body),
    bulk_delete_students.bulk_delete_students_listing)

router.put('/educare/transfer-student/:id', validate(joi_validation.students_transfer_body), validate(joi_validation.students_transfer_params),
    student_transfer.student_transfer)

router.post('/educare/upload-student/:id', validate(joi_validation.students_upload_params),
    file_uploade.file_uplode)

router.get('/educare/multi-api', validate(joi_validation.multi_api_query),
    multi_apis_fetch.multi_api_fetch)

router.get('/educare/get-direct-student', validate(joi_validation.students_fetch),
    students_direct_fetch.fetch_students_listing)



module.exports = router