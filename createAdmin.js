require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "agentDB",
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error(err));

// Create admin user
const createAdmin = async () => {
    try {
        const adminData = {
            email: "admin@example.com",
            password: "admin123",
            role: "admin"
        };

        const admin = await User.create(adminData);
        process.exit(0);
    } catch (error) {
        console.error("Error creating admin:", error);
        process.exit(1);
    }
};

createAdmin(); 