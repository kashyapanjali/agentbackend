const express = require("express");
const multer = require("multer");
const {
	uploadList,
	getListsByAgent,
} = require("../controllers/listController");
const router = express.Router();

const upload = multer({
	dest: "uploads/",
	fileFilter: (req, file, cb) => {
		const allowed = [".csv", ".xlsx", ".xls"];
		const ext = file.originalname.slice(file.originalname.lastIndexOf("."));
		allowed.includes(ext) ? cb(null, true) : cb(new Error("Invalid file type"));
	},
});

router.post("/upload", upload.single("file"), uploadList);
router.get("/agent/:id", getListsByAgent);

module.exports = router;
