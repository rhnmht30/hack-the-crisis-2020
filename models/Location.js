const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema(
	{
		lat: { type: Number, required: true },
		long: { type: Number, required: true },
		lastReportedCaseOn: { type: Date, default: Date.now },
		isSanitized: { type: Boolean, default: false },
		lastSanitizedOn: { type: Date },
		totalCases: { type: Number, default: 1 }
	},
	{ timestamps: true }
);

module.exports = Location = mongoose.model("Location", LocationSchema);
