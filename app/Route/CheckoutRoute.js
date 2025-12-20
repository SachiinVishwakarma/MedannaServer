const express = require("express");
const router = express.Router();
const Checkout = require("../Schema/Checkout");
const crypto = require("crypto");

router.post("/save-checkout", async (req, res) => {
    try {
        let {
            userId,
            selectedColor,
            forWhom,
            name,
            username,
            bloodType,
            hasInsurance,
            insuranceDetails,
            hasImplants,
            implantDetails,
        } = req.body;

        username = username.trim().toLowerCase();

        // validations
        if (!userId || !selectedColor || !forWhom || !name || !username || !bloodType) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        if (username.length < 4 || username.includes(" ")) {
            return res.status(400).json({
                success: false,
                message: "Invalid username",
            });
        }

        const existingUser = await Checkout.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Username already taken",
            });
        }

        const existingCheckout = await Checkout.findOne({ userId });
        if (existingCheckout) {
            return res.status(400).json({
                success: false,
                message: "Checkout already completed",
            });
        }

        // ✅ GENERATE UNIQUE QR TOKEN
        const qrToken = crypto.randomBytes(20).toString("hex");

        const newCheckout = new Checkout({
            userId,
            selectedColor,
            forWhom,
            name,
            username,
            bloodType,
            hasInsurance,
            insuranceDetails: hasInsurance ? insuranceDetails : null,
            hasImplants,
            implantDetails: hasImplants ? implantDetails : null,
            qrToken, // ✅ NEVER NULL
        });

        await newCheckout.save();

        return res.json({
            success: true,
            message: "Checkout saved successfully",
            data: {
                qrToken,
            },
        });

    } catch (err) {
        console.error("SAVE CHECKOUT ERROR:", err);

        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Duplicate value error",
            });
        }

        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});



router.get("/has-checkout/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const checkout = await Checkout.findOne({ userId });

        if (checkout) {
            return res.json({
                success: true,
                hasCheckout: true,
            });
        }

        return res.json({
            success: true,
            hasCheckout: false,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

router.get("/check-username/:username", async (req, res) => {
    try {
        const { username } = req.params;
        if (!username) {
            return res.status(400).json({
                success: false,
                message: "Username is required",
            });
        }

        const existingUser = await Checkout.findOne({
            username: { $regex: `^${username}$`, $options: "i" }
        });

        if (existingUser) {
            return res.json({
                success: true,
                available: false,
                message: "Username not available",
            });
        }

        return res.json({
            success: true,
            available: true,
            message: "Username available",
        });

    } catch (error) {
        console.log("USERNAME CHECK ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

module.exports = router;
