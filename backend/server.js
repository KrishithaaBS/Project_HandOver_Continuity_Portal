import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.listen(3000, () => {
    connectDB();
    console.log('Server is running on port 3000');
});


//krishithaabs_db_user
//zJ8nN9lEL6R9llc2
//mongodb+srv://<db_username>:zJ8nN9lEL6R9llc2@cluster1.azgtvbf.mongodb.net/?appName=Cluster1