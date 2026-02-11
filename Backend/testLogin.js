console.log("Starting script...");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const connectDB = async () => {
    try {
        // hardcoded URI to bypass dotenv issues
        await mongoose.connect('mongodb://localhost:27017/smart-virtual-lab');
        fs.writeFileSync('test_result.txt', 'INFO: MongoDB Connected\n', { flag: 'a' });
    } catch (error) {
        fs.writeFileSync('test_result.txt', `ERROR_CONNECT: ${error.message}`);
        process.exit(1);
    }
};

const fs = require('fs');

const testLogin = async () => {
    await connectDB();

    const email = 'admin@example.com';
    const password = 'admin123';

    try {
        console.log(`Attempting to find user: ${email}`);
        const user = await User.findOne({ email });

        if (!user) {
            fs.writeFileSync('test_result.txt', 'FAILURE: User NOT FOUND');
            process.exit(1);
        }

        const isMatch = await user.matchPassword(password);

        if (isMatch) {
            fs.writeFileSync('test_result.txt', 'SUCCESS: Password matches.');
        } else {
            console.log('Stored Hash:', user.password); // keeping log just in case
            fs.writeFileSync('test_result.txt', 'FAILURE: Password does NOT match.');
        }
        process.exit();
    } catch (error) {
        fs.writeFileSync('test_result.txt', `ERROR: ${error.message}`);
        process.exit(1);
    }
};

testLogin();
