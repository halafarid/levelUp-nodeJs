const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then( () => {
    console.info('Connected to mongo successfully!');
})
.catch( err => {
    console.error(err);
    process.exit();
})