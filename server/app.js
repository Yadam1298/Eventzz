const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const errorHandler = require('./middlewares/errorMiddleware');

const app = express();

app.use(express.json({ limit: '10mb' })); // for base64 images
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes will be added here later
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require("./routes/portfolioRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

app.use("/api/feedback", feedbackRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

app.use(errorHandler);

module.exports = app;
