// import helper functions
const { sendSuccess, sendError } = require("../utility/helpers");
const { BAD_REQUEST } = require("../utility/statusCodes");

module.exports.register = async (req, res) => {
	let { email } = req.body;

	let admin = await Admin.findOne({ email });

	if (admin) {
		return sendError(res, "Email already in use", BAD_REQUEST);
	} else {
		await Admin.create(req.body);
		return sendSuccess(res);
	}
};

module.exports.login = async (req, res) => {
	let { email, password } = req.body;
	let admin = await Admin.findOne({
		email: { $regex: `^${email}$`, $options: "i" }
	});
	if (!admin) return sendError(res, "Invalid User", BAD_REQUEST);
	const validPassword = await admin.isValidPwd(String(password).trim());
	if (!validPassword) return sendError(res, "Invalid Password", BAD_REQUEST);
	token = admin.generateAuthToken();
	sendSuccess(res, admin, token);
};

module.exports.addPatient = async (req, res) => {};

module.exports.updatePatient = async (req, res) => {};

module.exports.sanitizeLocation = async (req, res) => {};
