var mongoose=require('mongoose');
var schema=mongoose.Schema;

let reviews=new schema({
    comment:{type:String},
    user:{type:String},
    brand:{type:String},
});

module.exports=mongoose.model('reviews',reviews);