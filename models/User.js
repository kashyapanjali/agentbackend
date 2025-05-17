// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: [true, "Email is required"],
		unique: true,
		trim: true,
		lowercase: true,
		match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
	},
	password: {
		type: String,
		required: [true, "Password is required"],
		minlength: [6, "Password must be at least 6 characters long"]
	},
	role: {
		type: String,
		enum: ["admin"],
		default: "admin"
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

// Hash password before saving
UserSchema.pre("save", async function(next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 12);
	next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
