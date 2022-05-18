const mongoose = require('mongoose')

const dogSchema = new mongoose.Schema({
    dog_id:{
        type: String, 
        unique: true,
        trim: true,
        required: true
    },
    dog_name:{
        type: String, 
        trim: true,
        required: true
    },
    dog_desc:{
        type: String, 
        required: true
    },
    dog_dob:{
        type: String, 
        required: true
    },
    dog_status:{
        type: String, 
        required: true
    },
    dog_img:{
        type: Object,
        required: true
    }
},{
    timestamps: true
})

module.exports = mongoose.model("Dogs", dogSchema)