let report_model = require("../models/report")
let placement_model = require("../models/company-placement-model")
let company_model = require("../models/company-list-model")
let all_student_module = require("../models/all-students-model")

class report_services {
    async create_report(payload) {
        let roll_arr = payload.roll_no.split(",")
        payload.roll_arr = roll_arr
        let placement_detail = await placement_model.findOne({ "placement_id": payload.placement_id })
        if (!placement_detail) {
            return "invalid placement id"
        }
        let company_detail = await company_model.findOne({ "company_name": placement_detail.company_name })
        let student_fetch = []
        for (let x = 0; x < payload.roll_arr.length; x++) {
            let students_fetch = await all_student_module.find({ "roll_no": payload.roll_arr[x] })
            student_fetch.push(students_fetch)
        }
        
        if (student_fetch.length < payload.roll_arr.length) {
            let skip_roll1 = ""
            let take_roll1 = ""
            for (let i = 0; i < payload.roll_arr.length; i++) {

                let skip_roll = ""
                let take_roll = ""
                for (let j = 0; j < student_fetch.length; j++) {

                    if (payload.roll_arr[i] != student_fetch[j].roll_no) {
                        skip_roll += "," + payload.roll_arr[i]
                    } else {
                        take_roll += "," + payload.roll_arr[i]
                    }

                }
                skip_roll1 += skip_roll
                take_roll1 += take_roll
            }
            let data = {
                roll_no: take_roll1.slice(1).split(","),
                type: placement_detail.type,
                total_student_attend: payload.no_of_student_attend_placement,
                total_selected_student: take_roll1.slice(1).split(",").length,
                company_name: company_detail.company_name,
                placement_id: placement_detail.placement_id
            }
            let create_report = await report_model(data);
            let save_report = await create_report.save()
            if (save_report) {
                let total_student = company_detail.total_student_attend + data.total_student_attend
                let selected_student = company_detail.total_selected_student + data.total_selected_student
                let percentage = (selected_student / total_student) * 100
                let roundoff = Math.round((percentage+Number.EPSILON)*100)/100
                console.log(roundoff)
                let update = {
                    star: roundoff,
                    total_student_attend: total_student,
                    total_selected_student: selected_student
                }
                let update_rating = await company_model.findOneAndUpdate({ "company_name": placement_detail.company_name }, update)
                if (update_rating) {
                    let delete_placement = await placement_model.deleteOne({ "placement_id": payload.placement_id })
                    if (delete_placement) {
                        return "this roll no are not in database " + skip_roll1.slice(1) + " "
                    }
                }

            }

        }
        else{
            let data = {
                roll_no: payload.roll_arr,
                type: placement_detail.type,
                total_student_attend: payload.no_of_student_attend_placement,
                total_selected_student: payload.roll_arr.length,
                company_name: company_detail.company_name,
                placement_id: placement_detail.placement_id
            }
            let create_report = await report_model(data);
            let save_report = await create_report.save()
            if (save_report) {
                let total_student = company_detail.total_student_attend + data.total_student_attend
                let selected_student = company_detail.total_selected_student + data.total_selected_student
                let percentage = (selected_student / total_student) * 100
                let roundoff = Math.round((percentage+Number.EPSILON)*100)/100
                console.log(roundoff)
                let update = {
                    star: roundoff,
                    total_student_attend: total_student,
                    total_selected_student: selected_student
                }
                let update_rating = await company_model.findOneAndUpdate({ "company_name": placement_detail.company_name }, update)
                if (update_rating) {
                    let delete_placement = await placement_model.deleteOne({ "placement_id": payload.placement_id })
                    if (delete_placement) {
                        return "success"
                    }
                }

            }
        }

    }
    async fetch_report(query){
        console.log(query);
        let fetch_report = await report_model.find(query)
        return fetch_report
    }
}
module.exports = report_services