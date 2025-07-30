import dotenv from "dotenv"
import connectDB from "./db/dbConnection.js"
import { app } from './app.js'
import { setupWebSocket } from '../src/utils/websocket.js';
import http from 'http';
dotenv.config({
    path: './.env'
})

const server = http.createServer(app); 
setupWebSocket(server);
await connectDB().
then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
}).
catch((err) => {
    console.log("MONGO db connection failed !!!")
})

// Setup WebSocket for real-time notifications
// setupWebSocket(server);