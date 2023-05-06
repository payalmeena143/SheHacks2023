var mongoose=require('mongoose');
var schema=mongoose.Schema;

let brandschema=new schema({
    name:{type:String},
    url:{type:String},
    description:{type:String},
    itemtype:{type:String},
    rating:{type:Number},
    status:{type:String}
});

module.exports=mongoose.model('brands',brandschema);