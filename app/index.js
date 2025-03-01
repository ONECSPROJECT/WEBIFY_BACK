const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

dotenv.config({ path: './config.env' });

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
    console.log(`➡️ Incoming ${req.method} request to: ${req.url}`);
    console.log('🔹 Request Body:', req.body);
    next();
});

// Routes
app.use('/api/user', userRoutes);


app.all('*', (req, res) => {
    res.status(404).json({ status: 'fail', message: `Can't find ${req.originalUrl} on this server!` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});

