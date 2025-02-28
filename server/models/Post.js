const mongoose = required("mongoose");

const PostSchema = new mongoose.Schema({
    postID: {type: String, required: true, unique: true},
    postContent: {type: String, required: true},
    title: {type: String, required: true},
    dateline: {type: Date, default: Date.now},
    type: {type: String}
   

});

module.exports = mongoose.model("Post", PostSchema);