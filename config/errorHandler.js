const { sendError, logger } = require("../utility/helpers");
const { NOT_FOUND, SERVER_ERROR } = require("../utility/statusCodes");
//instead of using try{} catch(e){} everywhere for async functions we wrap them in a higher order function which catches the error and passes along to next middleware

//catchErrors is a function that takes any middleware which a route executes
module.exports.catchErrors = middlewareFunction => {
	//catchErrors return the middlewareFunction wrapped inside an anonymous function
	return async (req, res, next) => {
		//calling the passed middleware function
		//if there is an error then it catches it and passes on next()
		//using try and catch because if middleware function is synchronous then .catch() is undefined
		try {
			await middlewareFunction(req, res, next);
		} catch (err) {
			//log
			logger("error", "catchErrors", err);
			//send to next
			next(err);
		}
	};
};

// not found routes
module.exports.notFound = (req, res) => {
	logger("info", "Wrong endpoint request", `${req.params[0]} has been hit`);
	sendError(
		res,
		"Welcome to this API!! This route does not exist",
		NOT_FOUND
	);
};

module.exports.sendErrors = (err, req, res, next) => {
	const errorDetailsToSend = {
		message: err.message,
		status: err.status || SERVER_ERROR,
		error: true
	};
	//logging error for backend console
	console.log(errorDetailsToSend);
	console.log(err.stack);
	logger("fatal", "sendErrors", errorDetailsToSend);
	logger("fatal", "sendErrors", err.stack);

	//sending error to frontend
	sendError(res, err.message, err.status || SERVER_ERROR);
};
