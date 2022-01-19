import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { NextFunction } from "express";
import { config } from "../config.js";

interface HttpSocket {
  readonly io: Server;
}

class httpSocket implements HttpSocket {
  io: Server;
  constructor(server: Express.Application) {
    this.io = new Server(server, {
      cors: {
        origin: config.cors.allowedOrigin,
      },
    });

    this.io.use((socket: Socket, next: NextFunction) => {
      const token: string = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }
      jwt.verify(token, config.jwt.secretKey, (error: Error) => {
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

let socket: HttpSocket;
export function initSocket(server: Express.Application) {
  if (!socket) {
    socket = new httpSocket(server);
  }
}

export function getSocketIO(): Server {
  if (!socket) {
    throw new Error("Please call init first");
  }
  return socket.io;
}
