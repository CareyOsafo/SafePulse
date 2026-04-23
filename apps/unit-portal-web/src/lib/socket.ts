import { io, Socket } from 'socket.io-client';
import { getAccessToken } from './supabase';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

let socket: Socket | null = null;

export const connectSocket = async (): Promise<Socket> => {
  if (socket?.connected) return socket;

  const token = await getAccessToken();

  socket = io(`${SOCKET_URL}/ws`, {
    auth: { token },
    transports: ['websocket', 'polling'],
  });

  return new Promise((resolve, reject) => {
    socket!.on('connect', () => resolve(socket!));
    socket!.on('connect_error', reject);
  });
};

export const subscribeToEvent = <T>(
  event: string,
  callback: (data: T) => void,
): (() => void) => {
  socket?.on(event, callback);
  return () => socket?.off(event, callback);
};
