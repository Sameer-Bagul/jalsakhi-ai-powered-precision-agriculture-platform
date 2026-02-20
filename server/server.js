import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import farmRouter from './routes/farmRoutes.js';

const app = express();
const port = process.env.PORT || 3000;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: true, // Allow all origins for mobile development
    credentials: true
}));

// API Endpoints
app.get('/', (req, res) => {
    res.send('API working');
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/farms', farmRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});