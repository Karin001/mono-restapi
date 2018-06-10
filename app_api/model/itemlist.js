const mongoose = require('mongoose');

const iteminoutSchema = new mongoose.Schema({
    quantity: {type: Number, required: true},
    time:{type: Date, required: true},
    memo:{type: String}
});
const propertySchema = new mongoose.Schema({
    value:{type:String},
    unit:{type:String},
    precise:{type:String},
    volt:{type:Number}
})
const itemSchema = new mongoose.Schema({
    name: {type: String, required: true},
    marking: {type: String,required: true},
    childType: {type: String,required: true},
    footprint: {type: String,required: true},
    description: {type: String},
    brand: {type: String},
    quantity: {type: Number, required: true},
    property:propertySchema,
    in: [iteminoutSchema],
    out: [iteminoutSchema],
    project: {type: [String]},
    setUpTime: {type: Date, required: true}
});
const itemlist = new mongoose.Schema({
    username: {type: String, required: true},
    items: [itemSchema],
    itemTypes:{type: Object}
});
mongoose.model('itemlist', itemlist, 'itemlist' );