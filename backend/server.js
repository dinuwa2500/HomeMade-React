import express from "express";
import dotenv from 'dotenv'
import connectDB from './db/db.js'
import userRoutes from './routes/UserRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'
import { invalidPathHandler } from './middleware/errorHandler.js'
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes/UserRoutes.js'
import TicketRouter from './routes/TicketRoute.js'
import bodyParser from 'body-parser';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();
const app = express();

// Connect to database
connectDB();




app.use(cors());
app.use(express.json());
 app.use(bodyParser.json()); // Parse JSON bodies
 app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Example route
app.get('/', (req, res) => {
  res.send('API is running...');
});



app.use('/api/users', userRoutes);
app.use("/api", TicketRouter);




app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use(invalidPathHandler);
app.use(errorHandler);


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
