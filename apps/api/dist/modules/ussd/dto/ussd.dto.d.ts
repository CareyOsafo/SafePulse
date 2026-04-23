export declare class UssdRequestDto {
    sessionId: string;
    phoneNumber: string;
    serviceCode: string;
    text: string;
}
export declare class UssdResponseDto {
    response: string;
    endSession: boolean;
}
