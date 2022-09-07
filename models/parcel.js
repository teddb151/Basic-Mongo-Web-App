const mongoose = require('mongoose');

const parcelSchema = mongoose.Schema({
    _id:{type:mongoose.Schema.Types.ObjectId, auto: true},
    sender:{type: String, required: true},
    address:{type: String, required: true},
    weight:{type: Number, required: true},
    fragile: {type: String, required: true},
    desc: {type: String, required: true},
    shipType: {type: String, required: true},
    cost: {type: Number, required: true} 

})

module.exports = mongoose.model('parcel', parcelSchema);