const Agent = require("../models/Agent");
const bcrypt = require("bcryptjs");

// Create new agent
exports.createAgent = async (req, res) => {
	try {
		const { name, email, mobile, password } = req.body;

		// Check if agent already exists
		const existingAgent = await Agent.findOne({ email });
		if (existingAgent) {
			return res.status(400).json({
				success: false,
				message: "Agent with this email already exists"
			});
		}

		// Create new agent
		const agent = await Agent.create({
			name,
			email,
			mobile,
			password
		});

		res.status(201).json({
			success: true,
			data: {
				id: agent._id,
				name: agent.name,
				email: agent.email,
				mobile: agent.mobile,
				status: agent.status
			}
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error"
		});
	}
};

// Get all agents
exports.getAgents = async (req, res) => {
	try {
		const agents = await Agent.find().select("-password");
		res.status(200).json({
			success: true,
			count: agents.length,
			data: agents
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error"
		});
	}
};

// Update agent
exports.updateAgent = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, email, mobile, status } = req.body;

		const agent = await Agent.findById(id);
		if (!agent) {
			return res.status(404).json({
				success: false,
				message: "Agent not found"
			});
		}

		// Update fields
		if (name) agent.name = name;
		if (email) agent.email = email;
		if (mobile) agent.mobile = mobile;
		if (status) agent.status = status;

		await agent.save();

		res.status(200).json({
			success: true,
			data: {
				id: agent._id,
				name: agent.name,
				email: agent.email,
				mobile: agent.mobile,
				status: agent.status
			}
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error"
		});
	}
};

// Delete agent
exports.deleteAgent = async (req, res) => {
	try {
		const { id } = req.params;

		const agent = await Agent.findById(id);
		if (!agent) {
			return res.status(404).json({
				success: false,
				message: "Agent not found"
			});
		}

		await agent.remove();

		res.status(200).json({
			success: true,
			message: "Agent deleted successfully"
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error"
		});
	}
};
