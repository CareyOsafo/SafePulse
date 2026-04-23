import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../../auth/auth.service';
import { SocketEvents, RoomPatterns } from '@safepulse/shared';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
  agencyId?: string;
  unitId?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  },
  namespace: '/ws',
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients: Map<string, Set<string>> = new Map(); // userId -> Set<socketId>

  constructor(private readonly authService: AuthService) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        console.log('WebSocket connection rejected: No token');
        client.disconnect();
        return;
      }

      const payload = await this.authService.verifyToken(token);

      // Look up existing user, or auto-provision on first login
      let user = await this.authService.getAuthenticatedUser(payload.sub);
      if (!user) {
        console.log(`Auto-provisioning user for Supabase UID: ${payload.sub}`);
        user = await this.authService.autoProvisionUser(payload);
      }

      if (!user) {
        console.log('WebSocket connection rejected: User could not be created');
        client.disconnect();
        return;
      }

      // Attach user info to socket
      client.userId = user.id;
      client.userRole = user.appRole;
      client.agencyId = user.agencyId;
      client.unitId = user.unitId;

      // Track connected clients
      if (!this.connectedClients.has(user.id)) {
        this.connectedClients.set(user.id, new Set());
      }
      this.connectedClients.get(user.id)!.add(client.id);

      // Auto-join rooms based on role
      client.join(RoomPatterns.user(user.id));

      if (user.agencyId) {
        client.join(RoomPatterns.agency(user.agencyId));
      }

      if (user.unitId) {
        client.join(RoomPatterns.unit(user.unitId));
      }

      console.log(`WebSocket connected: ${user.id} (${user.appRole})`);

      client.emit('connected', {
        userId: user.id,
        role: user.appRole,
        agencyId: user.agencyId,
        unitId: user.unitId,
      });
    } catch (error: any) {
      const isDbError = error?.severity === 'FATAL' || error?.code?.startsWith('XX') || error?.code?.startsWith('08');
      if (isDbError) {
        console.error(`WebSocket: Database connection error (${error.code || 'unknown'}): ${error.message || error}`);
      } else {
        console.log('WebSocket connection rejected:', error.message || error);
      }
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      const userSockets = this.connectedClients.get(client.userId);
      if (userSockets) {
        userSockets.delete(client.id);
        if (userSockets.size === 0) {
          this.connectedClients.delete(client.userId);
        }
      }
      console.log(`WebSocket disconnected: ${client.userId}`);
    }
  }

  @SubscribeMessage(SocketEvents.JOIN_ROOM)
  handleJoinRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { room: string },
  ) {
    // Validate room access based on user role
    const { room } = data;

    if (room.startsWith('incident:')) {
      // Allow dispatchers and assigned units to join incident rooms
      if (client.userRole === 'dispatcher' || client.userRole === 'supervisor' || client.userRole === 'admin') {
        client.join(room);
        return { success: true, room };
      }
      // Citizens can join their own incident rooms (validated elsewhere)
    }

    if (room.startsWith('agency:') && client.agencyId && room === RoomPatterns.agency(client.agencyId)) {
      client.join(room);
      return { success: true, room };
    }

    if (room.startsWith('unit:') && client.unitId && room === RoomPatterns.unit(client.unitId)) {
      client.join(room);
      return { success: true, room };
    }

    return { success: false, error: 'Not authorized to join this room' };
  }

  @SubscribeMessage(SocketEvents.LEAVE_ROOM)
  handleLeaveRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { room: string },
  ) {
    client.leave(data.room);
    return { success: true };
  }

  // ============================================================
  // EMIT METHODS FOR SERVICES TO USE
  // ============================================================

  emitToUser(userId: string, event: string, data: any) {
    this.server.to(RoomPatterns.user(userId)).emit(event, data);
  }

  emitToAgency(agencyId: string, event: string, data: any) {
    this.server.to(RoomPatterns.agency(agencyId)).emit(event, data);
  }

  emitToUnit(unitId: string, event: string, data: any) {
    this.server.to(RoomPatterns.unit(unitId)).emit(event, data);
  }

  emitToIncident(incidentId: string, event: string, data: any) {
    this.server.to(RoomPatterns.incident(incidentId)).emit(event, data);
  }

  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }

  // Check if user is online
  isUserOnline(userId: string): boolean {
    return this.connectedClients.has(userId);
  }

  // Get online user count for agency
  getOnlineAgencyUsers(agencyId: string): number {
    const room = this.server.sockets.adapter.rooms.get(RoomPatterns.agency(agencyId));
    return room?.size || 0;
  }
}
