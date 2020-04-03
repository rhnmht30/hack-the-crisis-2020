const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const AdminSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true }
	},
	{ timestamps: true }
);

AdminSchema.pre("save", async function(next) {
	if (!this.isModified("password")) return next();
	let salt = await bcrypt.genSalt(10);
	let hash = await bcrypt.hash(this.password, salt);
	this.password = hash;
	next();
});

AdminSchema.methods.isValidPwd = async function(password) {
	let isMatchPwd = await bcrypt.compare(password, this.password);
	return isMatchPwd;
};

AdminSchema.methods.generateAuthToken = function() {
	const token = jwt.sign(
		{
			id: this._id,
			name: this.name,
			email: this.email
		},
		process.env.JWT_PRIVATE_KEY
	);
	return token;
};

module.exports = Admin = mongoose.model("Admin", AdminSchema);
