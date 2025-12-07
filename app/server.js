const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const connectDB = require('./Connection/db');
const authRoutes = require('./Route/authRoute');

const app = express();
connectDB();

app.use(cors());
app.use(bodyParser.json());

app.use('/api', authRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
