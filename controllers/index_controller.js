// import helper functions
const { sendSuccess, sendError } = require("../utility/helpers");
const { BAD_REQUEST } = require("../utility/statusCodes");

module.exports.index = (req, res) => {
	let apiDoc = {
		getPatients: {
			url: `http://${req.headers.host}/api/v1/patients`,
			type: "GET",
			specificQueries: [
				{
					query: "?pid=",
					info: "get particular patients data by passing its id"
				},
				{
					query: "?lid=",
					info:
						"get particular patients data in a location by passing only location id"
				}
			]
		},
		getLocations: {
			url: `http://${req.headers.host}/api/v1/locations`,
			type: "GET",
			specificQueries: [
				{
					query: "?lid=",
					info: "get particular locations data by passing its id"
				},
				{
					query: "?range=?currLat=?currLong=",
					info:
						"pass this range with current lat and long to get all locations within"
				}
			]
		}
	};
	sendSuccess(res, apiDoc);
};

module.exports.patientsData = async (req, res) => {
	let { pid, lid } = req.query;
	let data = {};

	if (pid) {
		let patient = await Patient.findById(pid).populate(
			"itinerary.location"
		);
		data = patient;
	} else {
		let patients = await Patient.aggregate([
			{
				$lookup: {
					from: "locations",
					localField: "itinerary.location",
					foreignField: "_id",
					as: "itinerary"
				}
			},
			{
				$project: {
					"itinerary.location.coordinates": 1,
					"itinerary.lastReportedCaseOn": 1,
					"itinerary.isSanitized": 1,
					"itinerary.lastSanitizedOn": 1,
					"itinerary.totalCases": 1,
					"itinerary._id": 1,
					city: 1,
					state: 1,
					gender: 1,
					age: 1,
					status: 1,
					reportedOn: 1
				}
			}
		]);
		if (lid) {
			patients = patients.filter(pat => {
				let index = pat.itinerary
					.map(l => {
						return String(l._id);
					})
					.includes(String(lid));
				if (index) return pat;
			});
		}
		data = {
			totalPatients: patients.length,
			patients
		};
	}
	sendSuccess(res, data);
};

module.exports.locationsData = async (req, res) => {
	let { lid, range, currLat, currLong } = req.query;
	let data = {};

	if (lid) {
		let loc = await Location.findById(lid);
		data = loc;
	} else {
		if (!range || !currLat || !currLong)
			return sendError(
				res,
				"Specify range and current position",
				BAD_REQUEST
			);
		let query = {
			location: {
				$near: {
					$geometry: {
						type: "Point",
						coordinates: [Number(currLong), Number(currLat)]
					},
					$maxDistance: range * 1000 //kms -> m
				}
			}
		};

		let locs = await Location.find(query);
		data = {
			totalLocations: locs.length,
			locs
		};
	}
	sendSuccess(res, data);
};
