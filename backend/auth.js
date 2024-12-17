const express = require('express');
const bcrypt = require('bcryptjs'); // Eksik import eklendi
const jwt = require('jsonwebtoken');
const User = require('./User');
const router = express.Router();

// Kullanıcı kayıt
router.post('/register', async (req, res) => {
    try {
        const { name, surname, phone, email, password, birthDate, role } = req.body;

        // Boş alan kontrolü
        if (!name || !surname || !phone || !email || !password || !birthDate || !role) {
            return res.status(400).json({ error: 'Please fill all fields.' });
        }

        // Email kontrolü
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already registered.' });
        }

        // Yeni kullanıcı oluşturma (Şifre hashleme User.js'te yapılıyor)
        const user = new User({ name, surname, phone, email, password, birthDate, role });
        await user.save();

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        console.error(err); // Daha ayrıntılı hata loglama
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

// Kullanıcı giriş
router.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Kullanıcı kontrolü
        const user = await User.findOne({ email });
        if (!user || user.role !== role) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }

        // Şifre doğrulama
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }

        // JWT token oluşturma
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, role: user.role });
    } catch (err) {
        console.error(err); // Daha ayrıntılı hata loglama
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

module.exports = router;