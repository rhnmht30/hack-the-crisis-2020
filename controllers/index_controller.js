// import helper functions
const { sendSuccess } = require("../utility/helpers");

module.exports.index = (req, res) => {
	let apiDoc = {
		getPatients: {
			url: `http://${req.headers.host}/api/v1/getPatients`,
			type: "GET",
			access: "public"
		},
		addPatient: {
			url: `http://${req.headers.host}/api/v1/admin/add`,
			type: "POST",
			access: "admin"
		},
		updatePatient: {
			url: `http://${req.headers.host}/api/v1/admin/update`,
			type: "POST",
			access: "admin"
		},
		sanitizeLocation: {
			url: `http://${req.headers.host}/api/v1/admin/sanitizeLocation`,
			type: "GET",
			access: "admin"
		}
	};
	sendSuccess(res, apiDoc);
};

module.exports.getPatients = async (req, res) => {};
