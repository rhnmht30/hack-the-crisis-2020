const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);

const LocationSchema = new mongoose.Schema(
	{
		location: {
			type: { type: String, default: "Point" },
			coordinates: [{ type: Number }]
		},
		lastReportedCaseOn: { type: Date, default: Date.now },
		isSanitized: { type: Boolean, default: false },
		lastSanitizedOn: { type: Date },
		totalCases: { type: Number, default: 1 }
	},
	{ timestamps: true }
);

LocationSchema.index({ location: "2dsphere" });

module.exports = Location = mongoose.model("Location", LocationSchema);
