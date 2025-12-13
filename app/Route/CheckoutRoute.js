const express = require("express");
const router = express.Router();
const Checkout = require("../Schema/Checkout");
router.post("/save-checkout", async (req, res) => {
    try {
        const {
            userId,
            selectedColor,
            forWhom,
            name,
            username,
            bloodType,
            hasInsurance,
            insuranceDetails,
            hasImplants,
            implantDetails
        } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "userId is required" });
        }

        if (!selectedColor || !forWhom || !name || !username || !bloodType) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Prevent duplicate form submission
        const existing = await Checkout.findOne({ userId });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Checkout already completed for this user"
            });
        }

        const newCheckout = new Checkout({
            userId,
            selectedColor,
            forWhom,
            name,
            username,
            bloodType,
            hasInsurance,
            insuranceDetails,
            hasImplants,
            implantDetails
        });

        await newCheckout.save();

        return res.json({
            success: true,
            message: "Checkout saved successfully",
            data: newCheckout
        });

    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
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
            username: username.toLowerCase(),
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
