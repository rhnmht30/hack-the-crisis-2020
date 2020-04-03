const express = require("express");
const router = express.Router();

// load controller
const {
	register,
	login,
	addPatient,
	updatePatient,
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
router.post("/add", validatePatient, catchErrors(addPatient));
router.post("/update", catchErrors(updatePatient));
router.get("/sanitize/:id", catchErrors(sanitizeLocation));

// export router
module.exports = router;
