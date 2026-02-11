const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const User = require('./models/User');
const Classroom = require('./models/Classroom');

dotenv.config();

const debugDB = async () => {
    const log = (msg) => {
        console.log(msg);
        fs.appendFileSync('debug_output.txt', msg + '\n');
    };

    try {
        fs.writeFileSync('debug_output.txt', 'Starting Debug Script...\n');
        await mongoose.connect(process.env.MONGO_URI);
        log('MongoDB Connected to: ' + mongoose.connection.host);

        const users = await User.find({});
        log('\n--- USERS ---');
        users.forEach(u => log(`${u._id} | ${u.name} | ${u.email} | ${u.role}`));

        const classrooms = await Classroom.find({});
        log('\n--- CLASSROOMS ---');
        if (classrooms.length === 0) {
            log('No classrooms found.');
        } else {
            classrooms.forEach(c => {
                log(`${c._id} | ${c.name} | Code: ${c.code}`);
                log(`\tTeacher: ${c.teacher}`);
                log(`\tStudents: ${c.students.length} students`);
                // log(`\tStudent IDs: ${c.students.join(', ')}`);
            });
        }

        mongoose.disconnect();
    } catch (error) {
        log('Error: ' + error);
        process.exit(1);
    }
};

debugDB();
