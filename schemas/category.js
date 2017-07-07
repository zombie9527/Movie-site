var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var CategorySchema = new Schema({
  index: Number,
  name: String,
  include:String,
}, {
  versionKey: false
})

// var ObjectId = mongoose.Schema.Types.ObjectId
CategorySchema.pre('save', function(next) {
  if (this.isNew) {
    this.index = this.index? this.index++:0;
  }

  next()
})

CategorySchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .sort('index')
      .exec(cb)
  },
  findById: function(id, cb) {
    return this
      .findOne({index: id})
      .exec(cb)
  }
}

module.exports = CategorySchema