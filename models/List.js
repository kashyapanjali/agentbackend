const mongoose = require("mongoose");
const ListSchema = new mongoose.Schema({
	agentId: mongoose.Schema.Types.ObjectId,
	firstName: String,
	phone: String,
	notes: String,
});
module.exports = mongoose.model("List", ListSchema);
