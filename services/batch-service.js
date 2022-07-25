const mongoose = require('mongoose');
const config = require('../configurations/config')
mongoose.connect(config.connection)
let db = mongoose.connection;
const Schema = mongoose.Schema;
const student_schema = require("../models/students-model")
const all_student_model = require("../models/all-students-model")
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
            if(query.department_id){
            filter["department_id"] = query.department_id
            }
            if(query.focus_student){
                filter["focus_student"] = query.focus_student
            }
            if(query._id){
                filter["_id"] = query._id
            }
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
    async mass_transfer(payload, params) {
        try {
            let batch_fetch = await batch_model.findOne({ _id: params.id })
            let department_fetch = await department_model.findOne({ _id: batch_fetch.department_id })
            let limit
            let focus
            let count
            let value
            if (payload.field === "intern") {
                count = department_fetch.intern_offer_letter
                limit = "intern_offer_letter"
                focus = "focus_student_intern"
                value = 1
            } else if (payload.field === "placement") {
                count = department_fetch.placement_offer_letter
                limit = "placement_offer_letter"
                focus = "focus_student_placement"
                value = 2
            }
            let obj = {}
            obj[`${limit}`] = { $gte: count }
            if (payload.field_value === 0 && batch_fetch.focus_student === value) {
                let update_obj = {}
                update_obj[`${focus}`] = 0
                try {
                    let schema_build = new Schema(student_schema)
                    let model = mongoose.model(`${batch_fetch.user_id}_students`, schema_build)
                    let update_focus_student = await model.updateMany({ batch_id: params.id }, update_obj)
                    if(update_focus_student){
                        let focus_student = await all_student_model.updateMany({ batch_id: params.id }, update_obj)
                    }
                    let update_department = await department_model.findOneAndUpdate({ _id: batch_fetch.department_id }, update_obj);
                    let update_batch = await batch_model.updateMany({ _id: params.id }, { focus_student: payload.field_value });
                    if (update_focus_student && update_department && update_batch) {
                        let output = {
                            skip: 0,
                            total_student_shifted: batch_fetch.total_student
                        }
                        return output
                    }
                } catch (err) {
                    if (err.name === "OverwriteModelError") {
                        let model = mongoose.model(`${batch_fetch.user_id}_students`)
                        
                        let update_focus_student = await model.updateMany({ batch_id: params.id }, update_obj)
                        if(update_focus_student){
                            let focus_student = await all_student_model.updateMany({ batch_id: params.id }, update_obj)
                        }
                        let update_department = await department_model.updateMany({ _id: batch_fetch.department_id }, update_obj);
                        let update_batch = await batch_model.updateMany({ _id: params.id }, { focus_student: payload.field_value });
                        if (update_focus_student && update_department && update_batch) {
                            let output = {
                                skip: 0,
                                total_student_shifted: batch_fetch.total_student
                            }
                            return output
                        }
                    }
                }
            } else if (payload.field_value != 0) {
                let update_obj = {}
                update_obj[`${focus}`] = 1


                let update_find_obj = {}
                update_find_obj[`${limit}`] = { $lt: count }
                try {
                    let schema_build = new Schema(student_schema)
                    let model = mongoose.model(`${batch_fetch.user_id}_students`, schema_build)

                    

                    if (batch_fetch.focus_student === 0) {
                        
                        let update_focus_student = await model.updateMany(update_find_obj, update_obj)
                        if(update_focus_student){
                            let focus_student = await all_student_model.updateMany(update_find_obj, update_obj)
                        }
                        let update_department = await department_model.updateMany({ _id: batch_fetch.department_id }, update_obj);
                        let update_batch = await batch_model.updateMany({ _id: params.id }, { focus_student: payload.field_value });
                        if (update_focus_student && update_department && update_batch) {
                            let output = {
                                skip:batch_fetch.total_student  - update_focus_student.modifiedCount,
                                total_student_shifted: update_focus_student.modifiedCount
                            }
                            return output
                        }
                    }
                    else {
                        return "batch already exit in another domine"
                    }
                } catch (err) {
                    if (err.name === "OverwriteModelError") {
                        let model = mongoose.model(`${batch_fetch.user_id}_students`)

                        
                       
                        if (batch_fetch.focus_student === 0) {
                            let update_focus_student = await model.updateMany(update_find_obj, update_obj)
                            if(update_focus_student){
                                let focus_student = await all_student_model.updateMany(update_find_obj, update_obj)
                            }
                            let update_department = await department_model.updateMany({ _id: batch_fetch.department_id }, update_obj);
                            let update_batch = await batch_model.updateMany({ _id: params.id }, { focus_student: payload.field_value });
                            if (update_focus_student && update_department && update_batch) {
                                let output = {
                                    skip:batch_fetch.total_student  - update_focus_student.modifiedCount,
                                    total_student_shifted: update_focus_student.modifiedCount
                                }
                                return output
                            }
                        } else {
                            return "batch already exit in another domine"
                        }
                    }
                }
            } else {
                return "already data in a respective domine"
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