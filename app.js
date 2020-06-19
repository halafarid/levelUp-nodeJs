const port = process.env.PORT || 3000;
const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config(); // To use .env file
require('./db'); // Connect to DB
require('express-async-errors'); // Handle try..catch

app.use(express.json());
app.use(express.urlencoded());
app.use(cors()); // Enable to call the server in FrontEnd

// Enable to use schemas
const userRouter = require('./router/user');
const jobRouter = require('./router/job');

app.use('/users', userRouter);
app.use('/jobs', jobRouter);

// For Testing
app.get('/', (req, res) => {
    res.send('<h1>Home From Server</h1>');
});

// Global Error
app.get( (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    if (statusCode >= 500)
        res.status(statusCode).json({
            message: 'Something went wrong'
        });
    else {
        res.status(statusCode).json({
            message: err.message
        })
    }
});

app.listen(port);