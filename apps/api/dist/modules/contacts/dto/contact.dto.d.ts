export declare class CreateContactDto {
    name: string;
    phoneNumber: string;
    relationship?: string;
    isPrimary?: boolean;
    notifyOnEmergency?: boolean;
}
export declare class UpdateContactDto {
    name?: string;
    phoneNumber?: string;
    relationship?: string;
    isPrimary?: boolean;
    notifyOnEmergency?: boolean;
}
