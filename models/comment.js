var mongoose = require("mongoose");

var Schema = mongoose.Schema;


var CommentSchema = new Schema({
 
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  
  // articleid: {
  //   type: Schema.Types.ObjectId,
  //   ref: "Article"
  // }
  
});


var Comment = mongoose.model("Comment", CommentSchema);


module.exports = Comment;
