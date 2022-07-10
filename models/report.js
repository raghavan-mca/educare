const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const report_schema = new Schema({
    roll_no: {
        type: Array, 
    },
    type: {
        type: Number,
        required: true,
    },
    total_student_attend: {
        type: Number,
        default: 0
    },
    total_selected_student: {
        type: Number,
        default: 0
    },
    company_name: {
        type: String,
        require: true,
    },
    placement_id: {
        type: String,
        require: true,
        unique: true,
        index: true
    },
    is_select: {
        type: Number,
        default: 0
    },
    

})

module.exports = mongoose.model('report', report_schema)