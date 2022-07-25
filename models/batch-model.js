const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const batch_schema = new Schema({
    batch:{
        type:String,
        required:true,
    },
    year:{
        type:String,
    },
    user_id:{
        type:String,
        require:true,
        unique:true,
    },
    total_student:{
        type:Number,
        default:0 
    },
    male:{
        type:Number,
        default:0 
    },
    female:{
        type:Number,
        default:0 
    },
    others:{
        type:Number,
        default:0 
    },
    department_id:{
        type:String,
        required:true,
    },
    focus_student:{
        type:Number,
        default:0 
    },
    is_select:{
        type:Number,
        default:0 
    }
})

module.exports = mongoose.model('batch',batch_schema)