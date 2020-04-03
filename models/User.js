const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true }
	},
	{ timestamps: true }
);

UserSchema.pre("save", async function(next) {
	if (!this.isModified("password")) return next();
	let salt = await bcrypt.genSalt(10);
	let hash = await bcrypt.hash(this.password, salt);
	this.password = hash;
	next();
});

UserSchema.methods.isValidPwd = async function(password) {
	let isMatchPwd = await bcrypt.compare(password, this.password);
	return isMatchPwd;
};

module.exports = User = mongoose.model("User", UserSchema);
