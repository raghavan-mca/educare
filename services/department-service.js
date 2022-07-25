
const mongoose = require('mongoose');
const config = require('../configurations/config')
mongoose.connect(config.connection)
let db = mongoose.connection;

const Schema = mongoose.Schema;
let department_model = require("../models/department-creation-model");
let batch_model = require("../models/batch-model")
let student_scheme = require("../models/students-model");

class department_services {
    async create_department(payload) {
        try {
            const departmentt_create = new department_model(payload)
            const department_list = await departmentt_create.save()
            if (department_list) {
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
    async fetch_department_listing(query) {
        try {
            let filter = {}
            if (query.department_name) {
                filter["$or"] = [{
                    "department_name": { $regex: query.department_name }
                }]
            }if(query.focus_student_intern){
                filter["focus_student_intern"] = query.focus_student_intern
            }
            if(query.focus_student_placement){
                filter["focus_student_placement"] = query.focus_student_placement
            
            }
            if(query.id){
                filter["_id"] = query.id
            }
            const fetch_department = await department_model.find(filter)
            return fetch_department
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
    async edit_department_listing(payload, params) {
        try {
            console.log(params.id);
            let batch_department = await department_model.findByIdAndUpdate(`${params.id}`, payload, { upsert: true })
            if (batch_department) {
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
    async delete_department_listing(params) {
        try {
            let students_data = await batch_model.find({ "department_id": params.id })
            let delete_department = await department_model.deleteOne({ _id: params.id })
            if (students_data.length > 0 && delete_department) {
                let delete_batch = await batch_model.deleteMany({ "department_id": params.id })
                let arr = []
                for (let i = 0; i < students_data.length; i++) {
                    let obj = {}
                    if (students_data[i].total_student > 0 && delete_batch) {

                        let drope_student_batch = await db.dropCollection(`${students_data[i].user_id}_students`)
                        if (drope_student_batch) {
                            obj["delete_batch_name"] = students_data[i].batch
                            obj["deletedCount"] = students_data[i].total_student
                            obj["no_of_students_deleted"] = students_data[i].total_student
                        }
                    } else {
                        obj["delete_batch_name"] = students_data[i].batch
                        obj["deletedCount"] = 0
                        obj["no_of_students_deleted"] = students_data[i].total_student

                    }

                    arr.push(obj)
                }
                let output = {
                    "deleted_data": arr,
                    "deleted_batch_count": arr.length
                }
                return output
            } else {
                delete_department["no_of_students_deleted"] = 0
                delete_department["no_of_batches_deleted"] = 0
                return delete_department
            }

        } catch (err) {
            return err
        }
    }
}


module.exports = department_services