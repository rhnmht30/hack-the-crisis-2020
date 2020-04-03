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

module.exports.validatePatient = (req, res, next) => {
	const { city, state, age, gender, status, itinerary } = req.body;
	if (!city || !state || !age || !gender || !status || !itinerary) {
		return sendError(res, "All Fields are mandatory!!", NOT_ACCEPTABLE);
	} else if (typeof itinerary !== "object" || itinerary.length === 0) {
		return sendError(res, "Location field should an array", NOT_ACCEPTABLE);
	} else if (wrongFormatOfItinerary(itinerary)) {
		return sendError(res, "Location fields are missing", NOT_ACCEPTABLE);
	} else {
		return next();
	}
};

const wrongFormatOfItinerary = it => {
	return it
		.map(i => {
			if (i.lat === undefined || i.long === undefined) return false;
			return true;
		})
		.includes(false);
};
