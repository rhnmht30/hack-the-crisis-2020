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

module.exports.addPatient = async (req, res) => {
	let { itinerary, ...rest } = req.body;

	let patient = await Patient.create(rest);

	for (let i = 0; i < itinerary.length; i++) {
		let { lat, long } = itinerary[i];
		let loc = await Location.findOne({
			[`location.coordinates`]: [Number(long), Number(lat)]
		});

		if (loc) {
			loc.totalCases = loc.totalCases ? loc.totalCases + 1 : 1;
			loc.lastReportedCaseOn = new Date(Date.now()).toISOString();
			loc.isSanitized = false;
			loc = await loc.save();
		} else {
			loc = new Location({
				location: {
					type: "Point",
					coordinates: [Number(long), Number(lat)]
				},
				lastReportedCaseOn: new Date(Date.now()).toISOString()
			});

			loc = await loc.save();
		}

		patient.itinerary.push({
			location: loc._id,
			notes: itinerary[i].notes
		});

		patient = await patient.save();
	}
	sendSuccess(res, patient);
};

module.exports.updatePatient = async (req, res) => {
	let { id } = req.params;

	let patient = await Patient.findById(id);

	if (patient) {
		patient = await Patient.findByIdAndUpdate(
			id,
			{ $set: req.body },
			{ new: true }
		);
	} else {
		return sendError(res, "Invalid patient");
	}

	sendSuccess(res, patient);
};

module.exports.sanitizeLocation = async (req, res) => {
	let { id } = req.params;
	let loc = await Location.findById(id);
	if (!loc) {
		return sendError(res, "Invalid location", BAD_REQUEST);
	}
	loc.isSanitized = true;
	loc.lastSanitizedOn = new Date(Date.now()).toISOString();

	loc = await loc.save();
	sendSuccess(res, loc);
};
