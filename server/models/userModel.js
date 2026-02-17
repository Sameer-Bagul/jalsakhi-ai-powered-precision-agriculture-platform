import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['farmer', 'admin'], required: true },
    mobile: { type: String },
    state: { type: String },
    district: { type: String },
    taluka: { type: String },
    village: { type: String },
    farmSize: { type: String },
    verifyOtp: { type: String, default: '' },
    verifyOtpExpireAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: '' },
    resetOtpExpireAt: { type: Number, default: 0 },
})

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
// if it already exists, it will use the existing one 
// it will create a new model 'user' with the schema 'userSchema'

export default userModel;

// Controller to handle the request and response for the user model
// This controller will manage the data for the user model
