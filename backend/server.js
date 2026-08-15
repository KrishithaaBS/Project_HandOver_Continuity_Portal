import 'dotenv/config'; // must be the first import so env vars exist before other modules load

import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';
import requestRoutes from './routes/requestRoutes.js';

const app = express();
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", requestRoutes);
app.use("/api", meetingRoutes);

await connectDB();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
