const mongoose = require('mongoose');

const ConnectDB = async () => {
    try{
        await mongoose.connect('mongodb://localhost:27017/CAPSTONE')
        console.log('Connected to the database.')
    }
    catch (error) {
        console.error('MongoDB connection failed.', error.message)
        process.exit(1);
    }
}