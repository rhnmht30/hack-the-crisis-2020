// import helper functions
const { sendSuccess } = require("../utility/helpers");

module.exports.index = (req, res) => {
	sendSuccess(res, "Welcome to this API!!");
};
