import { io, Socket } from "socket.io-client";
import { Message } from "./App";

// const socket = io("http://localhost:3001");

// socket.on("init-messages-published", (messages: Message[]) => {
//     setMessages(messages);
// });
// socket.on("new-message-sent", (message: Message) => {
//     setMessages((prev) => [...prev, message]);
// });

export const api = {
    socket: null as null | Socket,
    createConnection() {
        this.socket = io("http://localhost:3001");
    },
    on(
        initMessagesHandler: (
            messages: Message[],
            fn: (data: string) => void
        ) => void,
        newMessageHandler: (message: Message) => void,
        userTypingHandler: (user: any) => void
    ) {
        this.socket?.on("init-messages-published", initMessagesHandler);
        this.socket?.on("new-message-sent", newMessageHandler);
        this.socket?.on("user-typing-message", userTypingHandler);
    },
    destroyConnection() {
        this.socket?.disconnect();
        this.socket = null;
    },
    sendMessage(message: string) {
        this.socket?.emit(
            "client-message-sent",
            message,
            (error: string | null) => {
                if (error) alert(error);
            }
        );
    },
    sendClientName(name: string) {
        this.socket?.emit("client-name-sent", name);
    },
    typeMessage() {
        this.socket?.emit("client-typing");
    },
};
