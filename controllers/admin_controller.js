// import helper functions
const { sendSuccess, sendError } = require("../utility/helpers");
const { BAD_REQUEST } = require("../utility/statusCodes");
const ObjectId = require("mongoose").Types.ObjectId;

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
		let loc = await Location.findOne({ lat, long });

		if (loc) {
			loc.totalCases = loc.totalCases + 1;
			loc.lastReportedCaseOn = new Date(Date.now()).toISOString();
			loc.isSanitized = false;
			loc = await loc.save();
		} else {
			loc = new Location({
				lat: itinerary[i].lat,
				long: itinerary[i].long
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

module.exports.patientsData = async (req, res) => {
	let { pid, query, city, state, age, gender, status, sortBy } = req.query;
	let filters = {},
		data = {};

	if (pid) {
		let patient = await Patient.findById(pid).populate(
			"itinerary.location"
		);
		data = patient;
	} else {
		if (query) {
			const regex = new RegExp(escapeRegex(query), "gi");
			filters.$or = [{ city: regex }, { state: regex }];
		}
		if (city) {
			filters.city = city;
		}
		if (state) {
			filters.state = state;
		}
		if (age) {
			filters.age = Number(age);
		}
		if (gender) {
			filters.gender = gender;
		}

		if (status) {
			filters.status = status;
		}

		let sortObj = {};
		if (sortBy) {
			sortBy.map(sort => {
				if (sort === "createdAt") {
					sortObj[sort] = "desc";
				} else {
					sortObj[sort] = "asc";
				}
			});
		} else {
			sortObj = {
				createdAt: "desc"
			};
		}

		let patients = await Patient.find(filters).sort(sortObj);
		data = {
			totalPatients: patients.length,
			patients
		};
	}
	sendSuccess(res, data);
};

module.exports.locationsData = async (req, res) => {
	let { lid } = req.query;
	let data = {};

	if (lid) {
		let loc = await Location.findById(lid);
		data = loc;
	} else {
		let locs = await Location.find();
		data = {
			totalLocations: locs.length,
			locs
		};
	}
	sendSuccess(res, data);
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
