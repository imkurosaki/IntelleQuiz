import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import { IoManager } from './managers/IoManager'
import express, { Application } from 'express';
import { UserManager } from './managers/UserManager'
import { router as authRouter } from './routes/authRoute';
import session from 'express-session';
import passport from '../src/middlewares/passportMiddleware'
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app: Application = express();

export const httpServer = createServer(app);

const PORT = process.env.PORT;
httpServer.listen(PORT, () => {
   console.log(`Socket is listening to port ${PORT}`);
})

// Global middlewares
app.use(cookieParser());

// Middleware
app.use(cors({
   origin: 'http://localhost:5174', // Your React app's URL
   credentials: true,
}));
app.use(session({ secret: 'secretKey', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.initialize());

// Routes
app.use('/auth', authRouter);

// Socket.IO
const io: Server = IoManager.getIo(httpServer)
const userManager = new UserManager();

io.on('connection', (socket: any) => {
   userManager.addUser(socket)
})

