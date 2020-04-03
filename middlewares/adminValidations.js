const { sendError } = require("../utility/helpers");
const { NOT_ACCEPTABLE } = require("../utility/statusCodes");

let emailRegex = /^\S+@\S+\.\S+/,
	passwordRegex = /^[\S]{8,}/;

module.exports.validateAdmin = (req, res, next) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		return sendError(res, "All Fields are mandatory!!", NOT_ACCEPTABLE);
	} else if (!emailRegex.test(String(email))) {
		return sendError(res, "Email not Valid!!", NOT_ACCEPTABLE);
	} else if (!passwordRegex.test(String(password))) {
		return sendError(
			res,
			"Password should contain 8 characters",
			NOT_ACCEPTABLE
		);
	} else {
		return next();
	}
};
