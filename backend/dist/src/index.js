"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const IoManager_1 = require("./managers/IoManager");
const UserManager_1 = require("./managers/UserManager");
const httpServer = (0, http_1.createServer)();
httpServer.listen(3000, () => {
    console.log("Socket is listening to port 3000");
});
const io = IoManager_1.IoManager.getIo(httpServer);
const userManager = new UserManager_1.UserManager();
io.on('connection', (socket) => {
    userManager.addUser(socket);
});
