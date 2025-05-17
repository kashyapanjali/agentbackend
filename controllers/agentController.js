const Agent = require("../models/Agent");
const bcrypt = require("bcryptjs");

exports.createAgent = async (req, res) => {
	const { name, email, mobile, password } = req.body;
	const hashedPassword = await bcrypt.hash(password, 10);
	const agent = new Agent({ name, email, mobile, password: hashedPassword });
	await agent.save();
	res.json({ msg: "Agent created" });
};

exports.getAgents = async (req, res) => {
	const agents = await Agent.find();
	res.json(agents);
};
