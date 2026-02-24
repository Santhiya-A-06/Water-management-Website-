// Run this ONCE to create the admin account in MongoDB
// Usage: node createAdmin.js

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./db');

const createAdmin = async () => {
    await connectDB();

    const existing = await User.findOne({ email: 'admin@cleanwater360.org' });
    if (existing) {
        console.log('✅ Admin already exists! Email: admin@cleanwater360.org');
        process.exit(0);
    }

    await User.create({
        name: 'Admin',
        email: 'admin@cleanwater360.org',
        password: 'Admin@1234',
        role: 'admin',
    });

    console.log('✅ Admin account created!');
    console.log('   Email   : admin@cleanwater360.org');
    console.log('   Password: Admin@1234');
    process.exit(0);
};

createAdmin().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
