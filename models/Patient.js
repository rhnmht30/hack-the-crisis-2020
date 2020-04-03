const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema(
	{
		city: { type: String, required: true },
		state: { type: String, required: true },
		age: { type: Number, required: true },
		gender: { type: String, required: true },
		reportedOn: { type: Date, required: true },
		status: { type: String, required: true }, // confirmed, recovered, died
		itinerary: [
			{
				location: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Location"
				},
				notes: { type: String }
			}
		]
	},
	{ timestamps: true }
);

module.exports = Patient = mongoose.model("Patient", PatientSchema);
