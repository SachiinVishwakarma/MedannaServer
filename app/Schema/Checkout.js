const mongoose = require("mongoose");

const CheckoutSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    selectedColor: { type: String, required: true },

    forWhom: { type: String, enum: ["self", "family"], required: true },

    name: { type: String, required: true },
    username: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
    },

    bloodType: { type: String, required: true },

    hasInsurance: { type: Boolean, required: true },
    insuranceDetails: { type: String },

    hasImplants: { type: Boolean, required: true },
    implantDetails: { type: String },
    qrToken: {
        type: String,
        unique: true,
        sparse: true,
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Checkout", CheckoutSchema);
