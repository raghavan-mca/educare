const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const department_schema = new Schema({
    department_name:{
        type:String,
        require:true,
        unique:true,
        index:true
    },
    intern_offer_letter: {
        type: Number,
        default: 0
    },
    placement_offer_letter: {
        type: Number,
        default: 0
    },
    total_students:{
        type:Number,
        default:0
    },
    total_male:{
        type:Number,
        default:0
    },
    total_female:{
        type:Number,
        default:0
    },
    total_others:{
        type:Number,
        default:0
    },
    focus_student_placement:{
        type:Number,
        default:0
    },
    focus_student_intern:{
        type:Number,
        default:0
    },
    category:{
        type:String,
        require:true,
    },
    duration:{
        type:String,
        require:true,
    },
    batch:{
        type:Array
    },
    department_head:{
        type:String,
    },
    incharge:{
        type:String,
    }, 
    incharge_phone:{
        type:Number,
    },
    incharge_mail:{
        type:String,
    },
    is_select:{
        type:Number,
        default:0
    }

})

module.exports = mongoose.model('department',department_schema)