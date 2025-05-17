const List = require("../models/List");
const Agent = require("../models/Agent");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

// Upload and distribute CSV
exports.uploadAndDistribute = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({
				success: false,
				message: "Please upload a CSV file"
			});
		}

		const filePath = req.file.path;
		const results = [];
		const agents = await Agent.find({ status: "active" });

		if (agents.length === 0) {
			return res.status(400).json({
				success: false,
				message: "No active agents found"
			});
		}

		// Read CSV file
		await new Promise((resolve, reject) => {
			fs.createReadStream(filePath)
				.pipe(csv())
				.on("data", (data) => {
					results.push(data);
				})
				.on("end", () => {
					resolve();
				})
				.on("error", (error) => {
					reject(error);
				});
		});

		// Validate CSV format
		const requiredFields = ["FirstName", "Phone", "Notes"];
		const firstRow = results[0];

		const missingFields = requiredFields.filter(field => !(field in firstRow));

		if (missingFields.length > 0) {
			return res.status(400).json({
				success: false,
				message: `Missing required fields: ${missingFields.join(", ")}`
			});
		}

		// Distribute lists among agents
		const itemsPerAgent = Math.ceil(results.length / agents.length);
		const distributedLists = [];

		for (let i = 0; i < results.length; i++) {
			const agentIndex = Math.floor(i / itemsPerAgent) % agents.length;
			const agent = agents[agentIndex];

			const list = await List.create({
				agentId: agent._id,
				firstName: results[i].FirstName,
				phone: results[i].Phone,
				notes: results[i].Notes
			});

			distributedLists.push({
				agentId: agent._id,
				agentName: agent.name,
				listId: list._id,
				firstName: list.firstName,
				phone: list.phone,
				notes: list.notes
			});
		}

		// Delete uploaded file
		fs.unlinkSync(filePath);

		res.status(200).json({
			success: true,
			message: "Lists distributed successfully",
			data: {
				totalItems: results.length,
				itemsPerAgent,
				distributedLists
			}
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error"
		});
	}
};

// Get lists by agent
exports.getListsByAgent = async (req, res) => {
	try {
		const { agentId } = req.params;

		const lists = await List.find({ agentId })
			.sort({ createdAt: -1 });

		res.status(200).json({
			success: true,
			count: lists.length,
			data: lists
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error"
		});
	}
};

// Update list status
exports.updateListStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;

		const list = await List.findById(id);
		if (!list) {
			return res.status(404).json({
				success: false,
				message: "List not found"
			});
		}

		list.status = status;
		await list.save();

		res.status(200).json({
			success: true,
			data: list
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error"
		});
	}
};
