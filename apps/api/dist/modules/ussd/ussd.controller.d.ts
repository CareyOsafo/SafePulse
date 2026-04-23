import { UssdService } from './ussd.service';
import { UssdRequestDto } from './dto/ussd.dto';
export declare class UssdController {
    private readonly ussdService;
    constructor(ussdService: UssdService);
    handleSession(dto: UssdRequestDto): Promise<import("./dto/ussd.dto").UssdResponseDto>;
}
