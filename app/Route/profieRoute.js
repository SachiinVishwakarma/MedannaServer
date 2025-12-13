const express = require("express");
const router = express.Router();
const Checkout = require("../Schema/Checkout");

router.get("/profile/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required",
            });
        }

        const checkout = await Checkout.findOne({ userId });

        if (!checkout) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        return res.json({
            success: true,
            data: {
                name: checkout.name,
                username: `med-aana/${checkout.username}`,
                bloodType: checkout.bloodType,
                metalImplant: checkout.hasImplants ? "Yes" : "No",
                healthCarePolicy: checkout.hasInsurance ? "Yes" : "No",
                selectedColor: checkout.selectedColor,
            },
        });

    } catch (err) {
        console.log("PROFILE FETCH ERROR:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

router.get("/qr/:token", async (req, res) => {
    try {
        const profile = await Checkout.findOne({
            qrToken: req.params.token
        }).select("name username bloodType hasInsurance hasImplants");

        if (!profile) {
            return res.status(404).json({ success: false });
        }

        return res.json({
            success: true,
            data: {
                name: profile.name,
                username: profile.username,
                bloodType: profile.bloodType,
                metalImplant: profile.hasImplants ? "Yes" : "No",
                healthCarePolicy: profile.hasInsurance ? "Yes" : "No",
            }
        });

    } catch (err) {
        res.status(500).json({ success: false });
    }
});

module.exports = router;
