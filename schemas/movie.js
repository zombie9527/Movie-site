var mongoose = require('mongoose');

var MovieSchema = new mongoose.Schema({
    rating:Number,
    directors:String,
    title:String,
    country:String,
    summary:String,
    genres:String,
    poster:String,
    year:Number,
    new:String,
    comment:String,
    casts: String,
    aka: String,
    download_url:String,
}, {
  versionKey: false
})

MovieSchema.pre('save',function(next){
    // if (this.isNew) {
    //     this.meta.createAt = this.meta.updateAt = Date.now();
    // }
    // else {
    //     this.meta.updateAt = Date.now();
    // }

    next();
})
MovieSchema.statics={
    fetch:function(cb){
        return this
            .find({})
            .sort('year')
            .exec(cb)
        // var result = this.find({}).sort('year');
        // cb(result);
    },
    findById:function(id,cb){
        return this
            .findOne({_id:id})
            .exec(cb)
    }
}
module.exports = MovieSchema;