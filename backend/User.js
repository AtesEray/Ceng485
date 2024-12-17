const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    phone: { 
        type: String, 
        required: true, 
        validate: {
            validator: function(v) {
                return /^\d+$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        } 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: { type: String, required: true },
    birthDate: { type: Date, required: true },
    role: { type: String, enum: ['buyer', 'seller', 'expert'], required: true },
});

// Şifre hashleme
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', UserSchema);