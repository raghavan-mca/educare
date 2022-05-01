
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const csv = require('csvtojson');
const student_schema = require("../models/students-model");
const batch_model = require("../models/batch-model");
const department_model = require("../models/department-creation-model");
const placement_model = require("../models/company-placement-model");
const { number } = require('joi');

class students_services {
    async create_student(payload) {
        try {
            let students_data = await batch_model.find({ _id: payload.batch_id })
            let student_data_department = await department_model.find({ _id: students_data[0].department_id })

            payload["department_id"] = students_data[0].department_id
            payload["batch"] = students_data[0].batch
            payload["user_id"] = students_data[0].user_id

            try {
                let schema_build = new Schema(student_schema)
                let model = mongoose.model(`${students_data[0].user_id}_students`, schema_build)
                const student_create = new model(payload)
                const student_listing = await student_create.save()
                if (payload.gender === 1 && student_listing) {
                    let male_department = student_data_department[0].total_male + 1
                    let total_count = student_data_department[0].total_students + 1
                    let male = students_data[0].male + 1
                    let total = students_data[0].total_student + 1
                    let student_count_update_department = await department_model.findOneAndUpdate({ _id: students_data[0].department_id }, { total_male: male_department, total_students: total_count })
                    let student_count_update_batch = await batch_model.findOneAndUpdate({ _id: payload.batch_id }, { male: male, total_student: total })
                } else if (payload.gender === 2 && student_listing) {
                    let female_department = student_data_department[0].total_female + 1
                    let total_count = student_data_department[0].total_students + 1

                    let female = students_data[0].female + 1
                    let total = students_data[0].total_student + 1
                    let student_count_update_department = await department_model.findOneAndUpdate({ _id: students_data[0].department_id }, { total_female: female_department, total_students: total_count })
                    let student_count_update_batch = await batch_model.findOneAndUpdate({ _id: payload.batch_id }, { female: female, total_student: total })

                }
                if (student_listing) {
                    const output = {
                        'statuscode': 200,
                        'message': 'success',
                    }
                    return output
                }
            } catch (err) {
                if (err.name === "OverwriteModelError") {
                    let model = mongoose.model(`${students_data[0].user_id}_students`)
                    const student_create = new model(payload)
                    const student_listing = await student_create.save()
                    if (payload.gender === 1 && student_listing) {
                        let male_department = student_data_department[0].total_male + 1
                        let total_count = student_data_department[0].total_students + 1
                        let male = students_data[0].male + 1
                        let total = students_data[0].total_student + 1
                        let student_count_update_department = await department_model.findOneAndUpdate({ _id: students_data[0].department_id }, { total_male: male_department, total_students: total_count })
                        let student_count_update_batch = await batch_model.findOneAndUpdate({ _id: payload.batch_id }, { male: male, total_student: total })
                    } else if (payload.gender === 2 && student_listing) {
                        let female_department = student_data_department[0].total_female + 1
                        let total_count = student_data_department[0].total_students + 1

                        let female = students_data[0].female + 1
                        let total = students_data[0].total_student + 1
                        let student_count_update_department = await department_model.findOneAndUpdate({ _id: students_data[0].department_id }, { total_female: female_department, total_students: total_count })
                        let student_count_update_batch = await batch_model.findOneAndUpdate({ _id: payload.batch_id }, { female: female, total_student: total })

                    }
                    if (student_listing) {
                        const output = {
                            'statuscode': 200,
                            'message': 'success',
                        }
                        return output
                    }
                } else {

                    return err
                }
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
    async fetch_students_listing(query) {
        try {
            let filter = {}
            let fetch_batch_data = await batch_model.findOne({ _id: query.batch_id })

            if (query.name || query.roll_no) {
                if (query.name && query.roll_no) {
                    filter["$or"] = [{
                        "name": { $regex: query.name },
                        "roll_no": { $regex: query.roll_no }
                    }]
                }
                else if (query.name) {
                    filter["$or"] = [{
                        "name": { $regex: query.name }
                    }]
                }
                else if (query.roll_no) {
                    filter["$or"] = [{
                        "roll_no": { $regex: query.roll_no }
                    }]
                }
            }
            try {
                let schema_build = new Schema(student_schema)
                let model = mongoose.model(`${fetch_batch_data.user_id}_students`, schema_build)
                let fetch_students = await model.find(filter)
                return fetch_students
            } catch (err) {
                if (err.name === 'OverwriteModelError') {
                    let model = mongoose.model(`${fetch_batch_data.user_id}_students`)
                    let fetch_students = await model.find(filter)
                    return fetch_students
                };
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
    async sort_students_listing(query) {
        try {
            let fetch_batch_data = await batch_model.findOne({ _id: query.batch_id })

            let sort = {};
            sort[`${query.field}`] = query.order


            try {
                let schema_build = new Schema(student_schema)
                let model = mongoose.model(`${fetch_batch_data.user_id}_students`, schema_build)
                let sort_students = await model.find({}).sort(sort)
                return sort_students
            } catch (err) {
                if (err.name === 'OverwriteModelError') {
                    let model = mongoose.model(`${fetch_batch_data.user_id}_students`)
                    let sort_students = await model.find({}).sort(sort)
                    return sort_students
                };
            }
        }
        catch (err) {
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
    async edit_students_listing(payload, params) {
        try {
            let fetch_batch_data = await batch_model.findOne({ _id: params.id })
            let fetch_department_data = await department_model.findOne({ _id: fetch_batch_data.department_id })

            try {
                let schema_build = new Schema(student_schema)
                let model = mongoose.model(`${fetch_batch_data.user_id}_students`, schema_build)
                let edit_students = await model.findOneAndUpdate({ batch_id: params.id }, payload, { upsert: true })
                if (edit_students.gender === payload.gender) {

                    return edit_students
                } else {
                    if (payload.gender === 1) {
                        let male = fetch_batch_data.male - 1
                        let female = fetch_batch_data.female + 1
                        let department_male = fetch_department_data.total_male - 1
                        let department_female = fetch_department_data.total_female + 1
                        let update_batch_students = await batch_model.findOneAndUpdate({ _id: params.id }, { "male": male, "female": female })
                        let update_department_students = await department_model.findOneAndUpdate({ _id: fetch_batch_data.department_id }, { "total_male": department_male, "total_female": department_female })
                        if (update_batch_students && update_department_students) {
                            return edit_students
                        }
                    } else if (payload.gender === 2) {
                        let male = fetch_batch_data.male + 1
                        let female = fetch_batch_data.female - 1
                        let department_male = fetch_department_data.total_male + 1
                        let department_female = fetch_department_data.total_female - 1
                        let update_batch_students = await batch_model.findOneAndUpdate({ _id: params.id }, { "male": male, "female": female })
                        let update_department_students = await department_model.findOneAndUpdate({ _id: fetch_batch_data.department_id }, { "total_male": department_male, "total_female": department_female })
                        if (update_batch_students && update_department_students) {
                            return edit_students
                        }

                    }
                }

            } catch (err) {
                if (err.name === 'OverwriteModelError') {
                    let model = mongoose.model(`${fetch_batch_data.user_id}_students`)
                    let edit_students = await model.findOneAndUpdate({ batch_id: params.id }, payload, { upsert: true })
                    if (edit_students.gender === payload.gender) {

                        return edit_students
                    } else {
                        if (payload.gender === 1) {
                            let male = fetch_batch_data.male - 1
                            let female = fetch_batch_data.female + 1
                            let department_male = fetch_department_data.total_male - 1
                            let department_female = fetch_department_data.total_female + 1
                            let update_batch_students = await batch_model.findOneAndUpdate({ _id: params.id }, { "male": male, "female": female })
                            let update_department_students = await department_model.findOneAndUpdate({ _id: fetch_batch_data.department_id }, { "total_male": department_male, "total_female": department_female })
                            if (update_batch_students && update_department_students) {
                                return edit_students
                            }
                        } else if (payload.gender === 2) {
                            let male = fetch_batch_data.male + 1
                            let female = fetch_batch_data.female - 1
                            let department_male = fetch_department_data.total_male + 1
                            let department_female = fetch_department_data.total_female - 1
                            let update_batch_students = await batch_model.findOneAndUpdate({ _id: params.id }, { "male": male, "female": female })
                            let update_department_students = await department_model.findOneAndUpdate({ _id: fetch_batch_data.department_id }, { "total_male": department_male, "total_female": department_female })
                            if (update_batch_students && update_department_students) {
                                return edit_students
                            }

                        }
                    }
                };
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
    async delete_students_listing(params) {
        try {
            let fetch_batch_data = await batch_model.findOne({ _id: params.id })
            let fetch_department_data = await department_model.findOne({ _id: fetch_batch_data.department_id })
            try {
                let schema_build = new Schema(student_schema)
                let model = mongoose.model(`${fetch_batch_data.user_id}_students`, schema_build)
                let student_fetch = await model.findOne({ _id: params.student_id })

                let gender = student_fetch.gender

                let delete_student = await model.deleteOne({ _id: params.student_id })
                if (gender === 1 && delete_student) {
                    let male = fetch_batch_data.male - 1
                    let batch_total = fetch_batch_data.total_student - 1
                    let department_male = fetch_department_data.total_male - 1
                    let department_total = fetch_department_data.total_students - 1


                    let update_batch_students = await batch_model.findOneAndUpdate({ _id: params.id }, { "male": male, "total_student": batch_total })
                    let update_department_students = await department_model.findOneAndUpdate({ _id: fetch_batch_data.department_id }, { "total_male": department_male, "total_students": department_total })
                    if (update_batch_students && update_department_students) {
                        return delete_student
                    }
                } else if (gender === 2 && delete_student) {
                    let female = fetch_batch_data.female - 1
                    let batch_total = fetch_batch_data.total_student - 1
                    let department_female = fetch_department_data.total_female - 1
                    let department_total = fetch_department_data.total_students - 1
                    let update_batch_students = await batch_model.findOneAndUpdate({ _id: params.id }, { "total_student": batch_total, "female": female })
                    let update_department_students = await department_model.findOneAndUpdate({ _id: fetch_batch_data.department_id }, { "total_students": department_total, "total_female": department_female })
                    if (update_batch_students && update_department_students) {
                        return delete_student
                    }

                }
            }
            catch (err) {
                if (err.name === 'OverwriteModelError') {
                    let model = mongoose.model(`${fetch_batch_data.user_id}_students`)

                    let student_fetch = await model.findById(params.student_id)
                    let gender = student_fetch.gender
                    let delete_student = await model.deleteOne({ _id: params.student_id })
                    if (gender === 1 && delete_student) {
                        let male = fetch_batch_data.male - 1
                        let batch_total = fetch_batch_data.total_student - 1
                        let department_male = fetch_department_data.total_male - 1
                        let department_total = fetch_department_data.total_students - 1


                        let update_batch_students = await batch_model.findOneAndUpdate({ _id: params.id }, { "male": male, "total_student": batch_total })
                        let update_department_students = await department_model.findOneAndUpdate({ _id: fetch_batch_data.department_id }, { "total_male": department_male, "total_students": department_total })
                        if (update_batch_students && update_department_students) {
                            return delete_student
                        }
                    } else if (gender === 2 && delete_student) {
                        let female = fetch_batch_data.female - 1
                        let batch_total = fetch_batch_data.total_student - 1
                        let department_female = fetch_department_data.total_female - 1
                        let department_total = fetch_department_data.total_students - 1
                        let update_batch_students = await batch_model.findOneAndUpdate({ _id: params.id }, { "total_student": batch_total, "female": female })
                        let update_department_students = await department_model.findOneAndUpdate({ _id: fetch_batch_data.department_id }, { "total_students": department_total, "total_female": department_female })
                        if (update_batch_students && update_department_students) {
                            return delete_student
                        }

                    }

                }
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
    async bulk_delete_students_listing(payload, params) {
        let fetch_batch_data = await batch_model.findOne({ _id: params.id })

        let fetch_department_data = await department_model.findOne({ _id: fetch_batch_data.department_id })

        try {
            let schema_build = new Schema(student_schema)
            let model = mongoose.model(`${fetch_batch_data.user_id}_students`, schema_build)
            let student_fetch_male = await model.find({ "roll_no": { "$in": payload.ids }, "gender": 1 })
            let student_fetch_female = await model.find({ "roll_no": { "$in": payload.ids }, "gender": 2 })
            let delete_student = await model.deleteMany({ "roll_no": payload.ids })
            let total = student_fetch_male.length + student_fetch_female.length
            let male = fetch_batch_data.male - student_fetch_male.length
            let female = fetch_batch_data.female - student_fetch_female.length
            let batch_total = fetch_batch_data.total_student - total

            let department_male = fetch_department_data.total_male - student_fetch_male.length
            let department_female = fetch_department_data.total_female - student_fetch_female.length
            let department_total = fetch_department_data.total_students - total


            let update_batch_students = await batch_model.findOneAndUpdate({ _id: params.id }, { "male": male, "total_student": batch_total, "female": female })
            let update_department_students = await department_model.findOneAndUpdate({ _id: fetch_batch_data.department_id }, { "total_male": department_male, "total_female": department_female, "total_students": department_total })
            if (update_batch_students && update_department_students) {
                return delete_student
            }


        }
        catch (err) {
            if (err.name === 'OverwriteModelError') {
                let model = mongoose.model(`${fetch_batch_data.user_id}_students`)
                let student_fetch_male = await model.find({ "roll_no": { "$in": payload.ids }, "gender": 1 })
                let student_fetch_female = await model.find({ "roll_no": { "$in": payload.ids }, "gender": 2 })
                let delete_student = await model.deleteMany({ roll_no: payload.ids })
                let total = student_fetch_male.length + student_fetch_female.length
                let male = fetch_batch_data.male - student_fetch_male.length
                let female = fetch_batch_data.female - student_fetch_female.length
                let batch_total = fetch_batch_data.total_student - total

                let department_male = fetch_department_data.total_male - student_fetch_male.length
                let department_female = fetch_department_data.total_female - student_fetch_female.length
                let department_total = fetch_department_data.total_students - total


                let update_batch_students = await batch_model.findOneAndUpdate({ _id: params.id }, { "male": male, "total_student": batch_total, "female": female })
                let update_department_students = await department_model.findOneAndUpdate({ _id: fetch_batch_data.department_id }, { "total_male": department_male, "total_female": department_female, "total_students": department_total })
                if (update_batch_students && update_department_students) {
                    return delete_student
                }
            }
        }

    }
    async student_transfer(payload, params) {
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
            let update_find_obj = {}
            update_find_obj[`${limit}`] = { $lt: count }

            let obj = {}
            obj[`${limit}`] = { $gte: count }

            if (batch_fetch.focus_student === 0 && department_fetch[`${focus}`] === 0 && payload.field_value != 0) {
                try {

                    let schema_build = new Schema(student_schema)
                    let model = mongoose.model(`${batch_fetch.user_id}_students`, schema_build)
                    let find_limit = await model.find(obj)
                    let update_focus_student = await model.updateMany({ "roll_no": { "$in": payload.ids }, update_find_obj }, { [`${focus}`]: 1 })
                    let update_batch_focus_student = await batch_model.updateMany({ _id: params.id }, { focus_student: value })
                    let update_departmenbt_focus_student = await department_model.updateOne({ _id: batch_fetch.department_id }, { [`${focus}`]: 1 })
                    if (update_focus_student && update_batch_focus_student && update_departmenbt_focus_student) {
                        let output = {
                            skip: find_limit.length,
                            total_student_shifted: payload.ids.length - find_limit.length
                        }
                        return output
                    }
                }
                catch (err) {
                    if (err.name === 'OverwriteModelError') {

                        let model = mongoose.model(`${batch_fetch.user_id}_students`)
                        let find_limit = await model.find(obj)

                        let update_focus_student = await model.updateMany({ "roll_no": { "$in": payload.ids }, update_find_obj }, { [`${focus}`]: 1 })
                        let update_batch_focus_student = await batch_model.updateMany({ _id: params.id }, { focus_student: value })
                        let update_departmenbt_focus_student = await department_model.updateOne({ _id: batch_fetch.department_id }, { [`${focus}`]: 1 })
                        if (update_focus_student && update_batch_focus_student && update_departmenbt_focus_student) {
                            let output = {
                                skip: find_limit.length,
                                total_student_shifted: payload.ids.length - find_limit.length
                            }
                            return output
                        }
                    }
                }
            } else if (batch_fetch.focus_student === value && department_fetch[`${focus}`] === 1) {

                let update_focus_student
                try {
                    let schema_build = new Schema(student_schema)
                    let model = mongoose.model(`${batch_fetch.user_id}_students`, schema_build)
                    if (payload.field_value != 0) {

                        update_focus_student = await model.updateMany({ "roll_no": { "$in": payload.ids }, [`${limit}`]: { $lt: count } }, { [`${focus}`]: 1 })
                    } else if (payload.field_value === 0) {
                        update_focus_student = await model.updateMany({ "roll_no": { "$in": payload.ids } }, { [`${focus}`]: 0 })
                    }
                    if (update_focus_student) {
                        let output = {
                            skip: payload.ids.length - update_focus_student.modifiedCount,
                            total_student_shifted: update_focus_student.modifiedCount
                        }
                        return output
                    }
                }
                catch (err) {
                    if (err.name === 'OverwriteModelError') {
                        let model = mongoose.model(`${batch_fetch.user_id}_students`)
                        if (payload.field_value != 0) {
                            update_focus_student = await model.updateMany({ "roll_no": { "$in": payload.ids }, [`${limit}`]: { $lt: count } }, { [`${focus}`]: 1 })
                        } else if (payload.field_value === 0) {
                            update_focus_student = await model.updateMany({ "roll_no": { "$in": payload.ids }, [`${focus}`]: 1 }, { [`${focus}`]: 0 })
                        }
                        if (update_focus_student) {
                            let output = {
                                skip: payload.ids.length - update_focus_student.modifiedCount,
                                total_student_shifted: update_focus_student.modifiedCount
                            }
                            return output
                        }
                    }
                }
            } else {
                return "already in another domine"
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
    };
    async file_uplode(payload, params) {
        try {
            const csvFilePath = payload.file.tempFilePath
            let conflict_arr = []
            let delete_skip_arr = []
            let count = 0
            let delete_count = 0
            await csv()
                .fromFile(csvFilePath)
                .then(async (jsonObj) => {
                    let arr = []
                    for (let i = 0; i < jsonObj.length; i++) {
                        let obj = {};
                        let ten
                        let twelve
                        let ug
                        let pg
                        let diploma
                        if (jsonObj[i].ten) {
                            ten = Number(jsonObj[i].ten)
                        } else {
                            ten = null
                        } if (jsonObj[i].twelve) {
                            twelve = Number(jsonObj[i].twelve)
                        } else {
                            twelve = null
                        } if (jsonObj[i].ug) {
                            ug = Number(jsonObj[i].ug)
                        } else {
                            ug = null
                        } if (jsonObj[i].pg) {
                            pg = Number(jsonObj[i].pg)
                        } else {
                            pg = null
                        } if (jsonObj[i].diploma) {
                            diploma = Number(jsonObj[i].diploma)
                        } else {
                            diploma = null
                        }
                        let percentage = {
                            "ten": ten,
                            "twelve": twelve,
                            "ug": ug,
                            "pg": pg,
                            "diploma": diploma
                        }
                        obj["name"] = jsonObj[i].name;
                        obj["age"] = Number(jsonObj[i].age);
                        obj["dob"] = jsonObj[i].dob
                        obj["percentage"] = percentage
                        obj["mobile"] = Number(jsonObj[i].mobile)
                        obj["alternative_mobile"] = Number(jsonObj[i].alternative_mobile)
                        obj["email"] = jsonObj[i].email
                        if (jsonObj[i].gender.toLowerCase() === "male") {
                            obj["gender"] = 1
                        } else if (jsonObj[i].gender.toLowerCase() === "female") {
                            obj["gender"] = 2
                        }
                        obj["roll_no"] = jsonObj[i].roll_no
                        obj["controller"] = jsonObj[i].controller.toLowerCase()

                        if (jsonObj[i].controller.toLowerCase() === "a") {

                            let students_data = await batch_model.find({ _id: params.id })
                            let student_data_department = await department_model.find({ _id: students_data[0].department_id })

                            obj["department_id"] = students_data[0].department_id
                            obj["batch"] = students_data[0].batch
                            obj["user_id"] = students_data[0].user_id
                            obj["batch_id"] = params.id
                            arr.push(obj)
                            try {
                                let schema_build = new Schema(student_schema)
                                let model = mongoose.model(`${students_data[0].user_id}_students`, schema_build)
                                const student_create = new model(obj)
                                const student_listing = await student_create.save()

                                if (obj.gender === 1 && student_listing) {

                                    let male_department = student_data_department[0].total_male + 1
                                    let total_count = student_data_department[0].total_students + 1
                                    let male = students_data[0].male + 1
                                    let total = students_data[0].total_student + 1
                                    let student_count_update_department = await department_model.findOneAndUpdate({ _id: students_data[0].department_id }, { total_male: male_department, total_students: total_count })
                                    let student_count_update_batch = await batch_model.findOneAndUpdate({ _id: params.id }, { male: male, total_student: total })
                                    if (student_count_update_department && student_count_update_batch) {
                                        count += 1
                                    }
                                } else if (obj.gender === 2 && student_listing) {
                                    let female_department = student_data_department[0].total_female + 1
                                    let total_count = student_data_department[0].total_students + 1

                                    let female = students_data[0].female + 1
                                    let total = students_data[0].total_student + 1
                                    let student_count_update_department = await department_model.findOneAndUpdate({ _id: students_data[0].department_id }, { total_female: female_department, total_students: total_count })
                                    let student_count_update_batch = await batch_model.findOneAndUpdate({ _id: params.id }, { female: female, total_student: total })
                                    if (student_count_update_department && student_count_update_batch) {
                                        count += 1
                                    }
                                }



                            } catch (err) {
                                if (err.name === "OverwriteModelError") {
                                    let model = mongoose.model(`${students_data[0].user_id}_students`)
                                    const student_create = new model(obj)
                                    try {
                                        const student_listing = await student_create.save()
                                        if (obj.gender === 1 && student_listing) {
                                            let male_department = student_data_department[0].total_male + 1
                                            let total_count = student_data_department[0].total_students + 1
                                            let male = students_data[0].male + 1
                                            let total = students_data[0].total_student + 1
                                            let student_count_update_department = await department_model.findOneAndUpdate({ _id: students_data[0].department_id }, { total_male: male_department, total_students: total_count })
                                            let student_count_update_batch = await batch_model.findOneAndUpdate({ _id: params.id }, { male: male, total_student: total })
                                            if (student_count_update_department && student_count_update_batch) {
                                                count += 1
                                            }
                                        } else if (obj.gender === 2 && student_listing) {
                                            let female_department = student_data_department[0].total_female + 1
                                            let total_count = student_data_department[0].total_students + 1

                                            let female = students_data[0].female + 1
                                            let total = students_data[0].total_student + 1
                                            let student_count_update_department = await department_model.findOneAndUpdate({ _id: students_data[0].department_id }, { total_female: female_department, total_students: total_count })
                                            let student_count_update_batch = await batch_model.findOneAndUpdate({ _id: params.id }, { female: female, total_student: total })
                                            if (student_count_update_department && student_count_update_batch) {
                                                count += 1
                                            }
                                        }
                                    } catch (err) {
                                        if (err.code === 11000) {
                                            conflict_arr.push(jsonObj[i].roll_no)
                                        }
                                    }


                                } else if (err.code === 11000) {
                                    conflict_arr.push(jsonObj[i].roll_no)
                                }
                            }

                        }
                        else if (jsonObj[i].controller.toLowerCase() === "d") {
                            let fetch_batch_data = await batch_model.findOne({ _id: params.id })
                            let fetch_department_data = await department_model.findOne({ _id: fetch_batch_data.department_id })
                            try {
                                let schema_build = new Schema(student_schema)
                                let model = mongoose.model(`${fetch_batch_data.user_id}_students`, schema_build)

                                let delete_student = await model.deleteOne({ roll_no: jsonObj[i].roll_no })
                                if (obj.gender === 1 && delete_student && delete_student.deletedCount === 1) {
                                    let male = fetch_batch_data.male - 1
                                    let batch_total = fetch_batch_data.total_student - 1
                                    let department_male = fetch_department_data.total_male - 1
                                    let department_total = fetch_department_data.total_students - 1


                                    let update_batch_students = await batch_model.findOneAndUpdate({ _id: params.id }, { "male": male, "total_student": batch_total })
                                    let update_department_students = await department_model.findOneAndUpdate({ _id: fetch_batch_data.department_id }, { "total_male": department_male, "total_students": department_total })
                                    if (update_batch_students && update_department_students) {
                                        delete_count += 1
                                    }
                                } else if (obj.gender === 2 && delete_student && delete_student.deletedCount === 1) {
                                    let female = fetch_batch_data.female - 1
                                    let batch_total = fetch_batch_data.total_student - 1
                                    let department_female = fetch_department_data.total_female - 1
                                    let department_total = fetch_department_data.total_students - 1
                                    let update_batch_students = await batch_model.findOneAndUpdate({ _id: params.id }, { "total_student": batch_total, "female": female })
                                    let update_department_students = await department_model.findOneAndUpdate({ _id: fetch_batch_data.department_id }, { "total_students": department_total, "total_female": department_female })
                                    if (update_batch_students && update_department_students) {
                                        delete_count += 1
                                    }

                                } else if (delete_student.deletedCount === 0) {
                                    delete_skip_arr.push(jsonObj[i].roll_no)
                                }
                            }
                            catch (err) {
                                if (err.name === 'OverwriteModelError') {

                                    let model = mongoose.model(`${fetch_batch_data.user_id}_students`)

                                    let delete_student = await model.deleteOne({ roll_no: jsonObj[i].roll_no })
                                    if (obj.gender === 1 && delete_student.deletedCount === 1) {
                                        let male = fetch_batch_data.male - 1
                                        let batch_total = fetch_batch_data.total_student - 1
                                        let department_male = fetch_department_data.total_male - 1
                                        let department_total = fetch_department_data.total_students - 1


                                        let update_batch_students = await batch_model.findOneAndUpdate({ _id: params.id }, { "male": male, "total_student": batch_total })
                                        let update_department_students = await department_model.findOneAndUpdate({ _id: fetch_batch_data.department_id }, { "total_male": department_male, "total_students": department_total })
                                        if (update_batch_students && update_department_students) {
                                            delete_count += 1
                                        }
                                    } else if (obj.gender === 2 && delete_student.deletedCount === 1) {
                                        let female = fetch_batch_data.female - 1
                                        let batch_total = fetch_batch_data.total_student - 1
                                        let department_female = fetch_department_data.total_female - 1
                                        let department_total = fetch_department_data.total_students - 1
                                        let update_batch_students = await batch_model.findOneAndUpdate({ _id: params.id }, { "total_student": batch_total, "female": female })
                                        let update_department_students = await department_model.findOneAndUpdate({ _id: fetch_batch_data.department_id }, { "total_students": department_total, "total_female": department_female })
                                        if (update_batch_students && update_department_students) {
                                            delete_count += 1
                                        }

                                    } else if (delete_student.deletedCount === 0) {
                                        delete_skip_arr.push(jsonObj[i].roll_no)
                                    }

                                }
                            }
                        }



                    }
                })
            return {
                "add_count": count,
                "delete_count": delete_count,
                "duplicate_data": conflict_arr,
                "delete_skip_data": delete_skip_arr
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
    };
    async search_with_placement_id(query) {
        try {
            let fetch_placement = await placement_model.findOne({ placement_id: query.placement_id })
            let key_arr = Object.keys(fetch_placement.percentage)
            let value_arr = Object.values(fetch_placement.percentage)

            let obj = {};
            let ten_obj = {};
            let twelve_obj = {};
            let ug_obj = {};
            let pg_obj = {};
            let diploma_obj = {};

            let ten = false;
            let twelve = false;
            let ug = false;
            let pg = false;
            let diploma = false
            for (let i = 0; i < value_arr.length; i++) {

                if (value_arr[i] != null) {
                    if (key_arr[i] === "ten") {
                        ten_obj[`percentage.${key_arr[i]}`] = { "$gte": value_arr[i] }
                        ten = true
                    }
                    else if (key_arr[i] === "twelve") {
                        twelve_obj[`percentage.${key_arr[i]}`] = { "$gte": value_arr[i] }
                        twelve = true
                    }
                    else if (key_arr[i] === "ug") {
                        ug_obj[`percentage.${key_arr[i]}`] = { "$gte": value_arr[i] }
                        ug = true
                    }
                    else if (key_arr[i] === "pg") {
                        pg_obj[`percentage.${key_arr[i]}`] = { "$gte": value_arr[i] }
                        pg = true
                    }
                    else if (key_arr[i] === "diploma") {
                        diploma_obj[`percentage.${key_arr[i]}`] = { "$gte": value_arr[i] }
                        diploma = true
                    }
                }

            }
            let fetch_batch_data = await batch_model.findOne({ _id: query.id })
            try {
                let schema_build = new Schema(student_schema)
                let model = mongoose.model(`${fetch_batch_data.user_id}_students`, schema_build)

                if (ten && twelve && ug && pg && diploma) {
                    let students_find_one = await model.find({ 'percentage.ten': { "$gte": fetch_placement.percentage.ten }, 'percentage.twelve': { "$gte": fetch_placement.percentage.twelve }, 'percentage.ug': { "$gte": fetch_placement.percentage.ug }, 'percentage.pg': { "$gte": fetch_placement.percentage.pg }, 'percentage.diploma': { "$gte": fetch_placement.percentage.diploma } })
                    let students_find_two = await model.find({ 'percentage.ten': { "$gte": fetch_placement.percentage.ten }, 'percentage.twelve': null, 'percentage.ug': { "$gte": fetch_placement.percentage.ug }, 'percentage.pg': { "$gte": fetch_placement.percentage.pg }, 'percentage.diploma': { "$gte": fetch_placement.percentage.diploma } })
                    let students_find_three = await model.find({ 'percentage.ten': { "$gte": fetch_placement.percentage.ten }, 'percentage.twelve': { "$gte": fetch_placement.percentage.twelve }, 'percentage.ug': { "$gte": fetch_placement.percentage.ug }, 'percentage.pg': { "$gte": fetch_placement.percentage.pg }, 'percentage.diploma': null })
                    if (students_find_one && students_find_two && students_find_three) {
                        let result = [...students_find_one, ...students_find_two, ...students_find_three]
                        return result
                    }
                }
                else if (ten && twelve && ug && diploma) {
                    let students_find_one = await model.find({ 'percentage.ten': { "$gte": fetch_placement.percentage.ten }, 'percentage.twelve': { "$gte": fetch_placement.percentage.twelve }, 'percentage.ug': { "$gte": fetch_placement.percentage.ug }, 'percentage.pg': null, 'percentage.diploma': { "$gte": fetch_placement.percentage.diploma } })
                    let students_find_two = await model.find({ 'percentage.ten': { "$gte": fetch_placement.percentage.ten }, 'percentage.twelve': null, 'percentage.ug': { "$gte": fetch_placement.percentage.ug }, 'percentage.pg': null, 'percentage.diploma': { "$gte": fetch_placement.percentage.diploma } })
                    let students_find_three = await model.find({ 'percentage.ten': { "$gte": fetch_placement.percentage.ten }, 'percentage.twelve': { "$gte": fetch_placement.percentage.twelve }, 'percentage.ug': { "$gte": fetch_placement.percentage.ug }, 'percentage.pg': null, 'percentage.diploma': null })
                    if (students_find_one && students_find_two && students_find_three) {
                        let result = [...students_find_one, ...students_find_two, ...students_find_three]
                        return result
                    }
                } else if (ten && twelve && diploma) {
                    let students_find_one = await model.find({ 'percentage.ten': { "$gte": fetch_placement.percentage.ten }, 'percentage.twelve': { "$gte": fetch_placement.percentage.twelve }, 'percentage.ug': null, 'percentage.pg': null, 'percentage.diploma': { "$gte": fetch_placement.percentage.diploma } })
                    let students_find_two = await model.find({ 'percentage.ten': { "$gte": fetch_placement.percentage.ten }, 'percentage.twelve': null, 'percentage.ug': null, 'percentage.pg': null, 'percentage.diploma': { "$gte": fetch_placement.percentage.diploma } })
                    let students_find_three = await model.find({ 'percentage.ten': { "$gte": fetch_placement.percentage.ten }, 'percentage.twelve': { "$gte": fetch_placement.percentage.twelve }, 'percentage.ug': null, 'percentage.pg': null, 'percentage.diploma': null })
                    if (students_find_one && students_find_two && students_find_three) {
                        let result = [...students_find_one, ...students_find_two, ...students_find_three]
                        return result
                    }
                } else if (twelve && diploma) {
                    let students_find_one = await model.find({ 'percentage.ten': null, 'percentage.twelve': { "$gte": fetch_placement.percentage.twelve }, 'percentage.ug': null, 'percentage.pg': null, 'percentage.diploma': { "$gte": fetch_placement.percentage.diploma } })
                    let students_find_two = await model.find({ 'percentage.ten': null, 'percentage.twelve': null, 'percentage.ug': null, 'percentage.pg': null, 'percentage.diploma': { "$gte": fetch_placement.percentage.diploma } })
                    let students_find_three = await model.find({ 'percentage.ten': null, 'percentage.twelve': { "$gte": fetch_placement.percentage.twelve }, 'percentage.ug': null, 'percentage.pg': null, 'percentage.diploma': null })
                    if (students_find_one && students_find_two && students_find_three) {
                        let result = [...students_find_one, ...students_find_two, ...students_find_three]
                        return result
                    }
                } else if (twelve) {
                    let students_find_one = await model.find({ 'percentage.ten': null, 'percentage.twelve': { "$gte": fetch_placement.percentage.twelve }, 'percentage.ug': null, 'percentage.pg': null, 'percentage.diploma': null })
                    if (students_find_one) {
                        let result = students_find_one
                        return result
                    }
                } else if (ten) {
                    let students_find_one = await model.find({ 'percentage.ten': { "$gte": fetch_placement.percentage.ten }, 'percentage.twelve': null, 'percentage.ug': null, 'percentage.pg': null, 'percentage.diploma': null })
                    if (students_find_one) {
                        let result = students_find_one
                        return result
                    }
                } else if (ug) {
                    let students_find_one = await model.find({ 'percentage.ten': null, 'percentage.twelve': null, 'percentage.ug': { "$gte": fetch_placement.percentage.ug }, 'percentage.pg': null, 'percentage.diploma': null })
                    if (students_find_one) {
                        let result = students_find_one
                        return result
                    }
                } else if (pg) {
                    let students_find_one = await model.find({ 'percentage.ten': null, 'percentage.twelve': null, 'percentage.ug': null, 'percentage.pg': { "$gte": fetch_placement.percentage.pg }, 'percentage.diploma': null })
                    if (students_find_one) {
                        let result = students_find_one
                        return result
                    }
                } else if (diploma) {
                    let students_find_one = await model.find({ 'percentage.ten': null, 'percentage.twelve': null, 'percentage.ug': null, 'percentage.pg': null, 'percentage.diploma': { "$gte": fetch_placement.percentage.diploma } })
                    if (students_find_one) {
                        let result = students_find_one
                        return result
                    }
                }

            } catch (err) {
                if (err.name === 'OverwriteModelError') {
                    let model = mongoose.model(`${fetch_batch_data.user_id}_students`)
                    if (ten && twelve && ug && pg && diploma) {
                        let students_find_one = await model.find({ 'percentage.ten': { "$gte": fetch_placement.percentage.ten }, 'percentage.twelve': { "$gte": fetch_placement.percentage.twelve }, 'percentage.ug': { "$gte": fetch_placement.percentage.ug }, 'percentage.pg': { "$gte": fetch_placement.percentage.pg }, 'percentage.diploma': { "$gte": fetch_placement.percentage.diploma } })
                        let students_find_two = await model.find({ 'percentage.ten': { "$gte": fetch_placement.percentage.ten }, 'percentage.twelve': null, 'percentage.ug': { "$gte": fetch_placement.percentage.ug }, 'percentage.pg': { "$gte": fetch_placement.percentage.pg }, 'percentage.diploma': { "$gte": fetch_placement.percentage.diploma } })
                        let students_find_three = await model.find({ 'percentage.ten': { "$gte": fetch_placement.percentage.ten }, 'percentage.twelve': { "$gte": fetch_placement.percentage.twelve }, 'percentage.ug': { "$gte": fetch_placement.percentage.ug }, 'percentage.pg': { "$gte": fetch_placement.percentage.pg }, 'percentage.diploma': null })
                        if (students_find_one && students_find_two && students_find_three) {
                            let result = [...students_find_one, ...students_find_two, ...students_find_three]
                            return result
                        }
                    }
                    else if (ten && twelve && ug && diploma) {
                        let students_find_one = await model.find({ 'percentage.ten': { "$gte": fetch_placement.percentage.ten }, 'percentage.twelve': { "$gte": fetch_placement.percentage.twelve }, 'percentage.ug': { "$gte": fetch_placement.percentage.ug }, 'percentage.pg': null, 'percentage.diploma': { "$gte": fetch_placement.percentage.diploma } })
                        let students_find_two = await model.find({ 'percentage.ten': { "$gte": fetch_placement.percentage.ten }, 'percentage.twelve': null, 'percentage.ug': { "$gte": fetch_placement.percentage.ug }, 'percentage.pg': null, 'percentage.diploma': { "$gte": fetch_placement.percentage.diploma } })
                        let students_find_three = await model.find({ 'percentage.ten': { "$gte": fetch_placement.percentage.ten }, 'percentage.twelve': { "$gte": fetch_placement.percentage.twelve }, 'percentage.ug': { "$gte": fetch_placement.percentage.ug }, 'percentage.pg': null, 'percentage.diploma': null })
                        if (students_find_one && students_find_two && students_find_three) {
                            let result = [...students_find_one, ...students_find_two, ...students_find_three]
                            return result
                        }
                    } else if (ten && twelve && diploma) {
                        let students_find_one = await model.find({ 'percentage.ten': { "$gte": fetch_placement.percentage.ten }, 'percentage.twelve': { "$gte": fetch_placement.percentage.twelve }, 'percentage.ug': null, 'percentage.pg': null, 'percentage.diploma': { "$gte": fetch_placement.percentage.diploma } })
                        let students_find_two = await model.find({ 'percentage.ten': { "$gte": fetch_placement.percentage.ten }, 'percentage.twelve': null, 'percentage.ug': null, 'percentage.pg': null, 'percentage.diploma': { "$gte": fetch_placement.percentage.diploma } })
                        let students_find_three = await model.find({ 'percentage.ten': { "$gte": fetch_placement.percentage.ten }, 'percentage.twelve': { "$gte": fetch_placement.percentage.twelve }, 'percentage.ug': null, 'percentage.pg': null, 'percentage.diploma': null })
                        if (students_find_one && students_find_two && students_find_three) {
                            let result = [...students_find_one, ...students_find_two, ...students_find_three]
                            return result
                        }
                    } else if (twelve && diploma) {
                        let students_find_one = await model.find({ 'percentage.ten': null, 'percentage.twelve': { "$gte": fetch_placement.percentage.twelve }, 'percentage.ug': null, 'percentage.pg': null, 'percentage.diploma': { "$gte": fetch_placement.percentage.diploma } })
                        let students_find_two = await model.find({ 'percentage.ten': null, 'percentage.twelve': null, 'percentage.ug': null, 'percentage.pg': null, 'percentage.diploma': { "$gte": fetch_placement.percentage.diploma } })
                        let students_find_three = await model.find({ 'percentage.ten': null, 'percentage.twelve': { "$gte": fetch_placement.percentage.twelve }, 'percentage.ug': null, 'percentage.pg': null, 'percentage.diploma': null })
                        if (students_find_one && students_find_two && students_find_three) {
                            let result = [...students_find_one, ...students_find_two, ...students_find_three]
                            return result
                        }
                    } else if (twelve) {
                        let students_find_one = await model.find({ 'percentage.ten': null, 'percentage.twelve': { "$gte": fetch_placement.percentage.twelve }, 'percentage.ug': null, 'percentage.pg': null, 'percentage.diploma': null })
                        if (students_find_one) {
                            let result = students_find_one
                            return result
                        }
                    } else if (ten) {
                        let students_find_one = await model.find({ 'percentage.ten': { "$gte": fetch_placement.percentage.ten }, 'percentage.twelve': null, 'percentage.ug': null, 'percentage.pg': null, 'percentage.diploma': null })
                        if (students_find_one) {
                            let result = students_find_one
                            return result
                        }
                    } else if (ug) {
                        let students_find_one = await model.find({ 'percentage.ten': null, 'percentage.twelve': null, 'percentage.ug': { "$gte": fetch_placement.percentage.ug }, 'percentage.pg': null, 'percentage.diploma': null })
                        if (students_find_one) {
                            let result = students_find_one
                            return result
                        }
                    } else if (pg) {
                        let students_find_one = await model.find({ 'percentage.ten': null, 'percentage.twelve': null, 'percentage.ug': null, 'percentage.pg': { "$gte": fetch_placement.percentage.pg }, 'percentage.diploma': null })
                        if (students_find_one) {
                            let result = students_find_one
                            return result
                        }
                    } else if (diploma) {
                        let students_find_one = await model.find({ 'percentage.ten': null, 'percentage.twelve': null, 'percentage.ug': null, 'percentage.pg': null, 'percentage.diploma': { "$gte": fetch_placement.percentage.diploma } })
                        if (students_find_one) {
                            let result = students_find_one
                            return result
                        }
                    }
                };
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


module.exports = students_services