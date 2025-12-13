require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const connectDB = require('./Connection/db');
const authRoutes = require('./Route/authRoute');
const CheckoutRoute = require('./Route/CheckoutRoute');
const DeliveryAddressRoute = require('./Route/DeliveryAddressRoute')
const ProfileRoute= require('./Route/profieRoute')
const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use('/api', authRoutes);
app.use('/api/checkout', CheckoutRoute);
app.use('/api/address', DeliveryAddressRoute);
app.use('/api',ProfileRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});