const mongoose = require("mongoose");

const DeliveryAddressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // one address per user
  },

  fullName: { type: String, required: true },
  phone: { type: String, required: true },

  address: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },

  pincode: { type: String, required: true },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DeliveryAddress", DeliveryAddressSchema);
