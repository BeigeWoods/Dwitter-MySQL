import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
class httpSocket {
    constructor(server) {
        this.io = new Server(server, {
            cors: {
                origin: config.cors.allowedOrigin,
            },
        });
        this.io.use((socket, next) => {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error("Authentication error"));
            }
            jwt.verify(token, config.jwt.secretKey, (error) => {
                if (error) {
                    return next(new Error("Authentication error"));
                }
                next();
            });
        });
        this.io.on("connection", () => {
            console.log("Socket client connected");
        });
    }
}
let socket;
export function initSocket(server) {
    if (!socket) {
        socket = new httpSocket(server);
    }
}
export function getSocketIO() {
    if (!socket) {
        throw new Error("Please call init first");
    }
    return socket.io;
}
//# sourceMappingURL=socket.js.map