var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
    id: {type:String},
    name: {type:String},
    price: {type:String},
    tag: {type:String},
    pic: {type:String},
    leftAmount: {type:String}
});

ProductSchema.mothods = {

};

ProductSchema.statics = {
    findById: function(cb) {

    },
    findLeft: function(id, cb) {
        this.find({
                id: id
            }, {
                leftAmount: 1
            })
            .exec(cb);
    }
};

module.exports = ProductSchema;