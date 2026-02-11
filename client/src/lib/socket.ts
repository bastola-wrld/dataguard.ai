import { io } from 'socket.io-client';

// Auto-connect to the server
// In production, this URL should come from env vars
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
export const socket = io(SOCKET_URL, {
    autoConnect: true,
    transports: ['websocket'],
});
