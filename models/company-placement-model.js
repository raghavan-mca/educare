
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const company_placement_schema = new Schema({
    company_name:{
        type:String,
        required:true,
        index:true
    },
    type:{
        type:Number,
        required:true,
    },
    job_role:{
        type:String
    },
    placement_date:{
        type:String,
       
    },
    registration_date:{
        type:String,
    },
    salary:{
        min_salary:{
            type:Number,
            index:true
        },
        max_salary:{
            type:Number,
            index:true
        },
    },
    registration_link:{
        type:String
    },
    company_website:{
        type:String,
        required:true,
    },
    location:{
        type:String
    },
    company_email:{
        type:String,
        required:true,
    },
    percentage:{
        ten:{
            type:Number,
            index:true
        },
        twelve:{
            type:Number,
            index:true
        },
        ug:{
            type:Number,
            index:true
        },
        pg:{
            type:Number,
            index:true
        },
        diploma:{
            type:Number,
            index:true
        }
        
    },
    open_to_all:{
        type:Number,
        default:0, //1-open to all
        index:true
    },
    placement_id:{
        type:String,
        unique:true,
        index:true
    },
    registration_status:{
        type:Number,
        default:0,
        index:true   //1-registration close /2-registration not open
    },
    placement_status:{
        type:Number,
        default:0,
        index:true //1-waiting for result // 2-expire //3-pending
    },
    id:{
        type:String,
        required:true,
        index:true
    },
    registration_timestamp:{
        type:Number,
        required:false
    },
    placement_timestamp:{
        type:Number,
        required:false
    },
    
    is_select:{
        type:Number,
        default:0
    },
    


    
});

module.exports = mongoose.model('company_placement',company_placement_schema)
