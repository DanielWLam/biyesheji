var mongoose=require('mongoose');

var ProductSchema=new mongoose.Schema({
    id:String,
    name:String,
    price:Number,
    tag:[],
    pic:[]
});

ProductSchema.pre('save',function(next){
    var product = this;

});