var mongoose = require('mongoose');

var CartSchema = new mongoose.Schema({
    username: {type:String},
    productid: {type:String},
    amount:{type:Number}
});

CartSchema.mothods = {

};

CartSchema.statics = {
    findById: function(id,cb) {
        this.find({
            id:id
        }).exec(cb);
    },
    findLeft: function(id, cb) {
        this.find({
                id: id
            }, {
                leftAmount: 1,
                _id:0
            })
            .exec(cb);
    }
};

module.exports = CartSchema;