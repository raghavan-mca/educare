const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const company_list_schema = new Schema({
    company_name:{
        type:String,
        required:true,
        unique:true,
        index:true
    
    },
    website:{
        type:String,
        required:true,
        unique:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        index:true
    },
    is_select:{
        type:Number,
        default:0
    },
    star:{
        type:Number,
        default:0
    },
    total_student_attend:{
        type:Number,
        default:0
    },
    total_selected_student:{
        type:Number,
        default:0
    },
    id:{
        type:String,
        required:true,
        unique:true,
        index:true
    }

})

module.exports = mongoose.model('company_list',company_list_schema)