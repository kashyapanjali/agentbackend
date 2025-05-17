// models/Agent.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AgentSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Name is required"],
		trim: true
	},
	email: {
		type: String,
		required: [true, "Email is required"],
		unique: true,
		trim: true,
		lowercase: true,
		match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
	},
	mobile: {
		type: String,
		required: [true, "Mobile number is required"],
		trim: true,
		match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid mobile number with country code"]
	},
	password: {
		type: String,
		required: [true, "Password is required"],
		minlength: [6, "Password must be at least 6 characters long"]
	},
	status: {
		type: String,
		enum: ["active", "inactive"],
		default: "active"
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

// Hash password before saving
AgentSchema.pre("save", async function(next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 12);
	next();
});

// Method to compare password
AgentSchema.methods.comparePassword = async function(candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Agent", AgentSchema);
