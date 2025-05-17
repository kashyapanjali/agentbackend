const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
	uploadAndDistribute,
	getListsByAgent,
	updateListStatus
} = require("../controllers/listController");
const { protect } = require("../middleware/auth");

// Configure multer for file upload
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/");
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname));
	}
});

const upload = multer({
	storage: storage,
	fileFilter: function (req, file, cb) {
		console.log("File details:", {
			originalname: file.originalname,
			mimetype: file.mimetype
		});
		
		// Check file type
		const filetypes = /csv|xlsx|xls/;
		const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
		const mimetype = filetypes.test(file.mimetype);

		if (extname && mimetype) {
			return cb(null, true);
		} else {
			cb(new Error("Only CSV, XLSX, and XLS files are allowed!"));
		}
	}
}).single("file");

// Protect all routes
router.use(protect);

// List routes
router.post("/upload", (req, res) => {
	console.log("Upload request received");
	console.log("Request headers:", req.headers);
	
	upload(req, res, function(err) {
		if (err instanceof multer.MulterError) {
			console.error("Multer error:", err);
			return res.status(400).json({
				success: false,
				message: `Upload error: ${err.message}`
			});
		} else if (err) {
			console.error("Other error:", err);
			return res.status(400).json({
				success: false,
				message: err.message
			});
		}
		
		if (!req.file) {
			console.error("No file uploaded");
			return res.status(400).json({
				success: false,
				message: "Please upload a CSV file"
			});
		}
		
		console.log("File uploaded successfully:", req.file);
		uploadAndDistribute(req, res);
	});
});

router.get("/agent/:agentId", getListsByAgent);
router.put("/:id/status", updateListStatus);

module.exports = router;
