// server.js

import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// ✅ MongoDB Connection
const mongoUri =  'mongodb+srv://kumarpatelrakesh222:tY1RTSoZm8Pvn10L@ainodemate.nu7glsf.mongodb.net/?retryWrites=true&w=majority&appName=ainodemate';

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(error => {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    });

// ✅ User Schema and Model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// ✅ Signup Route
app.post('/api/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check for existing user
        if (await User.findOne({ username })) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        // Hash password and save user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        
        res.status(201).json({ message: 'Signup successful' });
    } catch (error) {
        console.error('❌ Error in Signup:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// ✅ Login Route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({ message: 'Login successful' }); // JWT can be added later
    } catch (error) {
        console.error('❌ Error in Login:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

app.get("/", (req, res) => {
    res.send("🚀 AI Notemate API is live");
});

export default app;
