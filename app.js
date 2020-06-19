const port = process.env.PORT || 3000;
const express = require('express');
const app = express();

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