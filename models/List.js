const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema({
	agentId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Agent",
		required: [true, "Agent ID is required"]
	},
	firstName: {
		type: String,
		required: [true, "First name is required"],
		trim: true
	},
	phone: {
		type: String,
		required: [true, "Phone number is required"],
		trim: true,
		match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"]
	},
	notes: {
		type: String,
		trim: true
	},
	status: {
		type: String,
		enum: ["pending", "completed"],
		default: "pending"
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

// Index for faster queries
ListSchema.index({ agentId: 1, createdAt: -1 });

module.exports = mongoose.model("List", ListSchema);
