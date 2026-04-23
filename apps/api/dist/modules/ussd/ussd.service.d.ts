import { DatabaseService } from '../../database/database.service';
import { IncidentsService } from '../incidents/incidents.service';
import { UsersService } from '../users/users.service';
import { UssdRequestDto, UssdResponseDto } from './dto/ussd.dto';
export declare class UssdService {
    private readonly db;
    private readonly incidentsService;
    private readonly usersService;
    constructor(db: DatabaseService, incidentsService: IncidentsService, usersService: UsersService);
    handleSession(dto: UssdRequestDto): Promise<UssdResponseDto>;
    private getSession;
    private createSession;
    private updateSession;
    private processState;
    private handleInit;
    private handleSelectType;
    private handleConfirm;
    private handleSelectLocation;
    private handleEnterLandmark;
    private createIncidentAndRespond;
}
