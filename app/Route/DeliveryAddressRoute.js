const express = require("express");
const router = express.Router();
const DeliveryAddress = require("../Schema/DeliveryAddress");

// SAVE OR UPDATE ADDRESS
router.post("/save-address", async (req, res) => {
  try {
    const {
      userId,
      fullName,
      phone,
      address,
      state,
      city,
      pincode,
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const savedAddress = await DeliveryAddress.findOneAndUpdate(
      { userId },
      {
        fullName,
        phone,
        address,
        state,
        city,
        pincode,
      },
      {
        new: true,
        upsert: true, // create if not exists
      }
    );

    res.json({
      success: true,
      message: "Address saved successfully",
      data: savedAddress,
    });
  } catch (error) {
    console.log("ADDRESS SAVE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// GET /api/address/has-address/:userId
router.get("/has-address/:userId", async (req, res) => {
  try {
    const address = await DeliveryAddress.findOne({
      userId: req.params.userId,
    });

    res.json({
      success: true,
      hasAddress: !!address,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


module.exports = router;
