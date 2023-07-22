import 'dotenv/config';
import {connectToMongo, getDb} from './db/conn.js';

connectToMongo((err) => {
    if (err) {
        console.log("error occurred:");
        console.error(err);
        process.exit();
    }
    console.log("Connected to MongoDB server");
    const db = getDb();
})