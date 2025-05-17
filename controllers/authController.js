const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Login user
exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Validate input
		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: "Please provide email and password"
			});
		}

		// Find user
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials"
			});
		}

		// Check password
		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials"
			});
		}

		// Generate JWT token
		const token = jwt.sign(
			{ id: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "1d" }
		);

		res.status(200).json({
			success: true,
			token,
			user: {
				id: user._id,
				email: user.email,
				role: user.role
			}
		});
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error"
		});
	}
};
