import { io, Socket } from 'socket.io-client';

// Extract base URL without /api suffix
const SOCKET_URL = 'http://192.168.1.5:3000';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
      });

      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });
    }
    return this.socket;
  }

  getSocket() {
    return this.socket || this.connect();
  }

  joinBooking(bookingId: number) {
    this.getSocket().emit('join_booking', bookingId.toString());
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
export default socketService;
