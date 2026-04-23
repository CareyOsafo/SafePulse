import { io, Socket } from 'socket.io-client';
import { getAccessToken } from './supabase';

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:4000';

let socket: Socket | null = null;

export const initSocket = async (): Promise<Socket> => {
  if (socket?.connected) {
    return socket;
  }

  const token = await getAccessToken();

  socket = io(`${SOCKET_URL}/ws`, {
    auth: { token },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  socket.on('connect', () => {
    console.log('[Socket] Connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('[Socket] Connection error:', error.message);
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinRoom = (room: string) => {
  socket?.emit('join_room', { room });
};

export const leaveRoom = (room: string) => {
  socket?.emit('leave_room', { room });
};

export const onIncidentUpdate = (
  incidentId: string,
  callback: (data: any) => void,
): (() => void) => {
  const room = `incident:${incidentId}`;
  joinRoom(room);

  const handler = (data: any) => {
    callback(data);
  };

  socket?.on('incident:updated', handler);
  socket?.on('incident:unit_assigned', handler);
  socket?.on('incident:status_changed', handler);
  socket?.on('incident:location_updated', handler);

  return () => {
    socket?.off('incident:updated', handler);
    socket?.off('incident:unit_assigned', handler);
    socket?.off('incident:status_changed', handler);
    socket?.off('incident:location_updated', handler);
    leaveRoom(room);
  };
};

export const onDeliveryResult = (callback: (data: any) => void): (() => void) => {
  const handler = (data: any) => {
    callback(data);
  };

  socket?.on('delivery:result', handler);

  return () => {
    socket?.off('delivery:result', handler);
  };
};
