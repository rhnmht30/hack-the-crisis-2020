const express = require("express");
const router = express.Router();

// load controller
const {
	register,
	login,
	addPatient,
	updatePatient,
	patientsData,
	locationsData,
	sanitizeLocation
} = require("../../../controllers/admin_controller");

// middlewares
let { catchErrors } = require("../../../config/errorHandler");
let { allAuth } = require("../../../middlewares/auth");
let {
	validateAdmin,
	validatePatient
} = require("../../../middlewares/adminValidations");

// routes
router.post("/", validateAdmin, catchErrors(register));
router.post("/login", catchErrors(login));
router.post("/add", allAuth, validatePatient, catchErrors(addPatient));
router.post("/update", allAuth, catchErrors(updatePatient));
router.get("/patients", allAuth, catchErrors(patientsData));
router.get("/locations", allAuth, catchErrors(locationsData));
router.get("/sanitize/:id", allAuth, catchErrors(sanitizeLocation));

// export router
module.exports = router;
