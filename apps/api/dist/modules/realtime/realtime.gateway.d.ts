import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../../auth/auth.service';
interface AuthenticatedSocket extends Socket {
    userId?: string;
    userRole?: string;
    agencyId?: string;
    unitId?: string;
}
export declare class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly authService;
    server: Server;
    private connectedClients;
    constructor(authService: AuthService);
    handleConnection(client: AuthenticatedSocket): Promise<void>;
    handleDisconnect(client: AuthenticatedSocket): void;
    handleJoinRoom(client: AuthenticatedSocket, data: {
        room: string;
    }): {
        success: boolean;
        room: string;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        room?: undefined;
    };
    handleLeaveRoom(client: AuthenticatedSocket, data: {
        room: string;
    }): {
        success: boolean;
    };
    emitToUser(userId: string, event: string, data: any): void;
    emitToAgency(agencyId: string, event: string, data: any): void;
    emitToUnit(unitId: string, event: string, data: any): void;
    emitToIncident(incidentId: string, event: string, data: any): void;
    broadcast(event: string, data: any): void;
    isUserOnline(userId: string): boolean;
    getOnlineAgencyUsers(agencyId: string): number;
}
export {};
