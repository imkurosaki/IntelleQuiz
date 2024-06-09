import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import { IoManager } from './managers/IoManager'
import { UserManager } from './managers/UserManager'

const httpServer = createServer()
httpServer.listen(3000, () => {
   console.log("Socket is listening to port 3000")
})

const io: Server = IoManager.getIo(httpServer)
const userManager = new UserManager();
io.on('connection', (socket: any) => {
   userManager.addUser(socket)
})

