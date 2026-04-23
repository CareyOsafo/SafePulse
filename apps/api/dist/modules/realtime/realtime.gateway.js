"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const auth_service_1 = require("../../auth/auth.service");
const shared_1 = require("@safepulse/shared");
let RealtimeGateway = class RealtimeGateway {
    constructor(authService) {
        this.authService = authService;
        this.connectedClients = new Map();
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '');
            if (!token) {
                console.log('WebSocket connection rejected: No token');
                client.disconnect();
                return;
            }
            const payload = await this.authService.verifyToken(token);
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
            client.userId = user.id;
            client.userRole = user.appRole;
            client.agencyId = user.agencyId;
            client.unitId = user.unitId;
            if (!this.connectedClients.has(user.id)) {
                this.connectedClients.set(user.id, new Set());
            }
            this.connectedClients.get(user.id).add(client.id);
            client.join(shared_1.RoomPatterns.user(user.id));
            if (user.agencyId) {
                client.join(shared_1.RoomPatterns.agency(user.agencyId));
            }
            if (user.unitId) {
                client.join(shared_1.RoomPatterns.unit(user.unitId));
            }
            console.log(`WebSocket connected: ${user.id} (${user.appRole})`);
            client.emit('connected', {
                userId: user.id,
                role: user.appRole,
                agencyId: user.agencyId,
                unitId: user.unitId,
            });
        }
        catch (error) {
            const isDbError = error?.severity === 'FATAL' || error?.code?.startsWith('XX') || error?.code?.startsWith('08');
            if (isDbError) {
                console.error(`WebSocket: Database connection error (${error.code || 'unknown'}): ${error.message || error}`);
            }
            else {
                console.log('WebSocket connection rejected:', error.message || error);
            }
            client.disconnect();
        }
    }
    handleDisconnect(client) {
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
    handleJoinRoom(client, data) {
        const { room } = data;
        if (room.startsWith('incident:')) {
            if (client.userRole === 'dispatcher' || client.userRole === 'supervisor' || client.userRole === 'admin') {
                client.join(room);
                return { success: true, room };
            }
        }
        if (room.startsWith('agency:') && client.agencyId && room === shared_1.RoomPatterns.agency(client.agencyId)) {
            client.join(room);
            return { success: true, room };
        }
        if (room.startsWith('unit:') && client.unitId && room === shared_1.RoomPatterns.unit(client.unitId)) {
            client.join(room);
            return { success: true, room };
        }
        return { success: false, error: 'Not authorized to join this room' };
    }
    handleLeaveRoom(client, data) {
        client.leave(data.room);
        return { success: true };
    }
    emitToUser(userId, event, data) {
        this.server.to(shared_1.RoomPatterns.user(userId)).emit(event, data);
    }
    emitToAgency(agencyId, event, data) {
        this.server.to(shared_1.RoomPatterns.agency(agencyId)).emit(event, data);
    }
    emitToUnit(unitId, event, data) {
        this.server.to(shared_1.RoomPatterns.unit(unitId)).emit(event, data);
    }
    emitToIncident(incidentId, event, data) {
        this.server.to(shared_1.RoomPatterns.incident(incidentId)).emit(event, data);
    }
    broadcast(event, data) {
        this.server.emit(event, data);
    }
    isUserOnline(userId) {
        return this.connectedClients.has(userId);
    }
    getOnlineAgencyUsers(agencyId) {
        const room = this.server.sockets.adapter.rooms.get(shared_1.RoomPatterns.agency(agencyId));
        return room?.size || 0;
    }
};
exports.RealtimeGateway = RealtimeGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RealtimeGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)(shared_1.SocketEvents.JOIN_ROOM),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(shared_1.SocketEvents.LEAVE_ROOM),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "handleLeaveRoom", null);
exports.RealtimeGateway = RealtimeGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
            credentials: true,
        },
        namespace: '/ws',
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], RealtimeGateway);
//# sourceMappingURL=realtime.gateway.js.map