import { io, Socket } from 'socket.io-client';
import { getAccessToken } from './supabase';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

let socket: Socket | null = null;

export const connectSocket = async (): Promise<Socket> => {
  if (socket?.connected) {
    return socket;
  }

  const token = await getAccessToken();

  socket = io(`${SOCKET_URL}/ws`, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  return new Promise((resolve, reject) => {
    socket!.on('connect', () => {
      console.log('Socket connected');
      resolve(socket!);
    });

    socket!.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      reject(error);
    });

    socket!.on('connected', (data) => {
      console.log('Socket authenticated:', data);
    });
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = (): Socket | null => socket;

export const joinRoom = (room: string) => {
  socket?.emit('join_room', { room });
};

export const leaveRoom = (room: string) => {
  socket?.emit('leave_room', { room });
};

// Event subscription helper
export const subscribeToEvent = <T = any>(
  event: string,
  callback: (data: T) => void,
): (() => void) => {
  socket?.on(event, callback);
  return () => {
    socket?.off(event, callback);
  };
};
