let student_schema = {
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    dob: {
        type: String,
        required: true,
    },
    gender: {
        type: Number,
        default: 0,
    },
    roll_no: {
        type: String,
        required: true,
        unique: true,
    },
    percentage: {
        ten: {
            type: Number,
            required: true,
        },
        twelve: {
            type: Number,
        },
        ug: {
            type: Number,
        },
        pg: {
            type: Number,
        },
        diploma: {
            type: Number,
        },
    },
    mobile: {
        type: Number,
        required: true,
        unique: true,
    },
    alternative_mobile: {
        type: Number,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    department_id: {
        type: String,
        required: true,
    },
    batch_id: {
        type: String,
        required: true,
    },
    intern_offer_letter: {
        type: Number,
        default: 0
    },
    placement_offer_letter: {
        type: Number,
        default: 0
    },
    focus_student_intern: {
        type: Number,
        default: 0
    },
    focus_student_placement: {
        type: Number,
        default: 0
    },
    is_select: {
        type: Number,
        default: 0
    },
    batch: {
        type: String,
        required: true,
    },
    user_id:{
        type:String,
        require:true,
    },
}

module.exports = student_schema