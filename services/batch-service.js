const mongoose = require('mongoose');
const config = require('../configurations/config')
mongoose.connect(config.connection)
let db = mongoose.connection;

let batch_model = require("../models/batch-model")
let department_model = require("../models/department-creation-model")

class batch_services {
    async create_batch(payload) {
        try {
            const fetch_department = await department_model.find({ _id: payload.department_id })
            let batch_insert = fetch_department[0].batch
            batch_insert.push(payload.batch)
            // payload["department_name"] = fetch_department[0].department_name
            const fetch_batch = await batch_model.find({ batch: payload.batch, department_id: payload.department_id })
            if (fetch_batch.length > 0) {
                return { "code": 11000 }
            }
            const batch_create = new batch_model(payload)
            const batch_listing = await batch_create.save()
            const update_batch_arr = await department_model.findOneAndUpdate({ _id: payload.department_id }, {
                batch: batch_insert
            })
            if (batch_listing) {
                const output = {
                    'statuscode': 200,
                    'message': 'success',
                }
                return output
            }
        } catch (err) {

            let err_function = new Error(err)
            let err_message = err_function.message
            let err_message_arr = err_message.split(':')

            if (err_message_arr[0] === 'ReferenceError') {
                let error = {
                    "code": 500,
                    "ErrorMessage": err_message
                }
                return error
            }
            if (err_message_arr[0] === 'MongoServerError') {
                let error = {
                    "code": 11000,
                    "ErrorMessage": err_message
                }
                return error
            }
            return err
        }
    }
    async fetch_batch(query) {
        try {
            let filter = {}
            filter["department_id"] = query.department_id
            let fetch_batch = await batch_model.find(filter)
            return fetch_batch
        } catch (err) {

            let err_function = new Error(err)
            let err_message = err_function.message
            let err_message_arr = err_message.split(':')

            if (err_message_arr[0] === 'ReferenceError') {
                let error = {
                    "code": 500,
                    "ErrorMessage": err_message
                }
                return error
            }
            if (err_message_arr[0] === 'MongoServerError') {
                let error = {
                    "code": 11000,
                    "ErrorMessage": err_message
                }
                return error
            }
            return err
        }
    }
    async edit_batch(payload, params) {
        try {
            let arr = [];
            let batch_fetch = await batch_model.findOne({ _id: params.id });
            let batch_name = batch_fetch.batch
            let fetch_department = await department_model.findOne({ _id: batch_fetch.department_id })
            fetch_department.batch.find((elm) => {
                if (elm != batch_name) {
                    arr.push(elm)
                }
            })
            arr.push(payload.batch)
            let batch_edit = await batch_model.findOneAndUpdate({ _id: params.id }, payload, { upsert: true })
            let department_update = await department_model.findOneAndUpdate({ _id: batch_fetch.department_id }, { batch: arr }, { upsert: true })
            if (batch_edit && department_update) {
                return department_update
            }
        } catch (err) {
            let err_function = new Error(err)
            let err_message = err_function.message
            let err_message_arr = err_message.split(':')

            if (err_message_arr[0] === 'ReferenceError') {
                let error = {
                    "code": 500,
                    "ErrorMessage": err_message
                }
                return error
            }
            if (err_message_arr[0] === 'MongoServerError') {
                let error = {
                    "code": 11000,
                    "ErrorMessage": err_message
                }
                return error
            }
            return err
        }

    }
    async delete_batch(params) {
        try {
            let arr = [];
            let batch_fetch = await batch_model.findOne({ _id: params.id });
            
            let batch_name = batch_fetch.batch
           
            let fetch_department = await department_model.findOne({ _id: batch_fetch.department_id })
            fetch_department.batch.find((elm) => {
                if (elm != batch_name) {
                    arr.push(elm)
                }
            })
            let department_update = await department_model.findOneAndUpdate({ _id: batch_fetch.department_id }, { batch: arr }, { upsert: true })
            let batch_delete = await batch_model.findByIdAndDelete(params.id)
            let obj = {};
            let result_arr = [];
            if (batch_fetch.total_student > 0) {
                let drope_student_batch = await db.dropCollection(`${batch_fetch.user_id}_students`)
                if (drope_student_batch) {
                    obj["delete_batch_name"] = batch_fetch.batch
                    obj["deletedCount"] = batch_fetch.total_student
                    obj["no_of_students_deleted"] = batch_fetch.total_student
                    result_arr.push(obj)
                    return result_arr

                }
            } else {
                obj["delete_batch_name"] = batch_fetch.batch
                obj["deletedCount"] = 0
                obj["no_of_students_deleted"] = 0
                result_arr.push(obj)
                return result_arr
            }

        } catch (err) {
            let err_function = new Error(err)
            let err_message = err_function.message
            let err_message_arr = err_message.split(':')

            if (err_message_arr[0] === 'ReferenceError') {
                let error = {
                    "code": 500,
                    "ErrorMessage": err_message
                }
                return error
            }
            if (err_message_arr[0] === 'MongoServerError') {
                let error = {
                    "code": 11000,
                    "ErrorMessage": err_message
                }
                return error
            }
            return err
        }
    }
}


module.exports = batch_services