const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = Schema({
	username: {type: String, required: true},
	password: {type: String, required: true},
	privacy: {type: Boolean, required: true},
	total_quizzes: {type: Number, default: 0},
	total_score: {type: Number, default: 0}
});

userSchema.statics.findUsers = function(arr, callback){
	this.find({privacy: true}, function(err, results){
		if(err){
			callback(err);
			return;
		}
		callback(null, results);
	});
}

module.exports = mongoose.model("User", userSchema);
