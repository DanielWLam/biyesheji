var mongoose=require('mongoose');
var bcrypt=require('bcrypt-nodejs');
var SALT_WORK_FACTOR=10;

var UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: {
        type:String
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    },
    right:{
        type:Number,
        default:1   //1 is normal user, 0 is admin user
    }
});

UserSchema.pre('save', function(next) {
    var user = this;

    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) {
            console.log(err);
            return next(err);
        } else {
            bcrypt.hash(user.password, salt, null, function(err, result) {
                if (err) {
                    console.log(err);
                    return next(err);
                } else {
                    user.password = result;
                    next();
                }
            })
        }
    })
});

UserSchema.methods={
    comparePassword:function(_password,cb){
        bcrypt.compare(_password,this.password,function(err,isMatch){
            if(err) return cb(err);
            cb(null,isMatch);
        })
    }
}

UserSchema.statics = {
    fetch: function(cb) {
        return this.find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function(id, cb) {
        return this.findOne({
            _id: id
        })
            .sort('meta.updateAt')
            .exec(cb)
    }
}

module.exports = UserSchema;