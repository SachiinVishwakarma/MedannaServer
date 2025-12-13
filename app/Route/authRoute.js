const express = require("express");
const router = express.Router();
const User = require("../Schema/User");

// Generate 4-digit OTP
function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

// Check user existence and verification status
router.post("/check-user", async (req, res) => {
    const { phone } = req.body;
    console.log("This api hit /check-user", phone);
    if (!phone) return res.status(400).json({ message: "Phone is required" });

    try {
        const user = await User.findOne({ phone });
        if (!user) {
            return res.json({ exists: false });
        }

        // User exists
        return res.json({
            exists: true,
            isVerified: user.isVerified,
            userId: user._id
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Register new user or generate OTP for existing unverified user
router.post("/register", async (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone number is required" });

    const otp = generateOTP();

    try {
        let user = await User.findOne({ phone });

        if (!user) {
            // Create new user
            user = new User({ phone, otp, isVerified: false });
        } else {
            // Update OTP for existing unverified user
            user.otp = otp;
            user.isVerified = false;
        }

        await user.save();

        return res.json({
            success: true,
            message: "OTP sent successfully",
            userId: user._id,
            otp,
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
// Debug route
router.get("/debug", (req, res) => {
    res.send("Hiii user, I am here");
});
// Get all users
router.get("/users", async (req, res) => {
    try {
        const users = await User.find(); // Fetch all documents

        return res.json({
            success: true,
            count: users.length,
            users,
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
    const { phone, otp } = req.body;
    if (!phone || !otp)
        return res.status(400).json({ message: "Phone & OTP required" });

    try {
        const user = await User.findOne({ phone });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.otp !== otp)
            return res.status(400).json({ message: "Incorrect OTP" });

        user.isVerified = true;
        user.otp = null;
        await user.save();

        return res.json({ success: true, message: "OTP Verified" });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;
