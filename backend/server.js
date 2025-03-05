require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const projectRoutes = require("./src/routes/projectRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const messageRoutes = require("./src/routes/messageRoutes");
const Message = require("./src/models/Message");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:5173" } });

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/project", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/messages", messageRoutes);
app.use("/uploads", express.static("uploads"));

const activeUsers = new Map();

io.on("connection", (socket) => {
    console.log(`✅ User connected (Socket ID: ${socket.id})`);

    socket.on("userConnected", (userId) => {
        activeUsers.set(userId, socket.id);
    });

    socket.on("sendMessage", async ({ sender, receiver, message }) => {
        try {
            const newMessage = new Message({ sender, receiver, message, isRead: false });
            await newMessage.save();
    
            const savedMessage = await Message.findById(newMessage._id).populate("sender receiver", "name _id");
    
            // Send message to receiver if online
            const receiverSocket = activeUsers.get(receiver);
            if (receiverSocket) {
                io.to(receiverSocket).emit("receiveMessage", savedMessage);
            }
    
            // Also send message back to sender for UI update
            const senderSocket = activeUsers.get(sender);
            if (senderSocket) {
                io.to(senderSocket).emit("receiveMessage", savedMessage);
            }
        } catch (error) {
            console.error("❌ Message saving error:", error);
        }
    });

    socket.on("disconnect", () => {
        activeUsers.forEach((socketId, userId) => {
            if (socketId === socket.id) activeUsers.delete(userId);
        });
    });
});

const PORT = process.env.PORT || 5000;
connectDB();
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
