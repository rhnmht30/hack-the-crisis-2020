const express = require("express");
const router = express.Router();

// load controller
const {
	index,
	locationsData,
	patientsData
} = require("../../../controllers/index_controller");

// middlewares
let { catchErrors } = require("../../../config/errorHandler");

// routes
router.get("/", catchErrors(index));
router.get("/patients", catchErrors(patientsData));
router.get("/locations", catchErrors(locationsData));
// export router
module.exports = router;
