import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

const PORT = process.env.PORT || 3001;

app.use(cors());
app.get("/", (req, res) => {
    res.status(200);
    res.send();
});

const messages = [
    {
        message: "Hello",
        id: "234dsf",
        user: { id: "dsfsdfsdf", name: "Vlad" },
    },
    { message: "Yo", id: "sdf", user: { id: "sdfs", name: "Anonym" } },
    {
        message: "Hello",
        id: "234dsf",
        user: { id: "dsfsdfsdf", name: "Vlad" },
    },
];

const users = new Map();

io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("disconnect", () => {
        console.log("user disconnected");
        users.delete(socket);
    });

    users.set(socket, { id: new Date().toString(), name: "anonym" });

    socket.on("client-name-sent", (name: string) => {
        if (typeof name !== "string") {
            return;
        }

        const user = users.get(socket);
        user.name = name;
    });

    socket.on("client-typing", () => {
        socket.broadcast.emit("user-typing-message", users.get(socket));
    });

    socket.on("client-message-sent", (message: string, successFn: any) => {
        if (typeof message !== "string" || message.length > 20) {
            successFn("Message length should be less than 20 chars");
            return;
        }

        const user = users.get(socket);

        const messageItem = {
            message: message,
            id: new Date().toString(),
            user: { id: user.id, name: user.name },
        };

        messages.push(messageItem);

        io.emit("new-message-sent", messageItem);

        successFn(null);
    });

    socket.emit("init-messages-published", messages, (data: string) => {
        console.log("init messages received: " + data);
    });
});

server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});
