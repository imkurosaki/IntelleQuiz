"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IoManager = void 0;
const socket_io_1 = require("socket.io");
class IoManager {
    static getIo(httpServer) {
        if (!this.io) {
            this.io = new socket_io_1.Server(httpServer, {
                cors: {
                    origin: "*",
                    methods: ["GET", "POST"]
                }
            });
        }
        return this.io;
    }
}
exports.IoManager = IoManager;
