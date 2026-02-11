const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const seedAdmin = async () => {
    await connectDB();

    const adminExists = await User.findOne({ email: 'admin@example.com' });

    if (adminExists) {
        console.log('Admin already exists. Deleting to ensure fresh credentials...');
        await User.deleteOne({ email: 'admin@example.com' });
    }

    try {
        const admin = await User.create({
            name: 'System Admin',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin'
        });

        console.log('Admin account created: admin@example.com / admin123');

        // internal verification
        const isMatch = await admin.matchPassword('admin123');
        console.log('Self-Verification check:', isMatch ? 'SUCCESS' : 'FAILED');

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedAdmin();
