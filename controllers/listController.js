const List = require("../models/List");
const Agent = require("../models/Agent");
const XLSX = require("xlsx");
const fs = require("fs");

exports.uploadList = async (req, res) => {
	const file = req.file;
	if (!file) return res.status(400).json({ msg: "No file uploaded" });

	const workbook = XLSX.readFile(file.path);
	const sheet = workbook.Sheets[workbook.SheetNames[0]];
	const data = XLSX.utils.sheet_to_json(sheet);

	const agents = await Agent.find();
	if (agents.length < 5)
		return res.status(400).json({ msg: "Need at least 5 agents" });

	// Distribute
	const distributed = Array.from({ length: agents.length }, () => []);
	data.forEach((item, index) => {
		distributed[index % agents.length].push(item);
	});

	// Save to DB
	for (let i = 0; i < agents.length; i++) {
		for (let entry of distributed[i]) {
			await List.create({
				agentId: agents[i]._id,
				firstName: entry.FirstName,
				phone: entry.Phone,
				notes: entry.Notes,
			});
		}
	}

	fs.unlinkSync(file.path);
	res.json({ msg: "List uploaded and distributed" });
};

exports.getListsByAgent = async (req, res) => {
	const agentId = req.params.id;
	const data = await List.find({ agentId });
	res.json(data);
};
