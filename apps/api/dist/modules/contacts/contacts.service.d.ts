import { DatabaseService } from '../../database/database.service';
import { CreateContactDto, UpdateContactDto } from './dto/contact.dto';
export declare class ContactsService {
    private readonly db;
    constructor(db: DatabaseService);
    getUserContacts(userId: string): Promise<{
        id: any;
        name: any;
        phoneNumber: any;
        relationship: any;
        isPrimary: any;
        notifyOnEmergency: any;
        createdAt: any;
        updatedAt: any;
    }[]>;
    createContact(userId: string, dto: CreateContactDto): Promise<{
        id: any;
        name: any;
        phoneNumber: any;
        relationship: any;
        isPrimary: any;
        notifyOnEmergency: any;
        createdAt: any;
        updatedAt: any;
    }>;
    updateContact(userId: string, contactId: string, dto: UpdateContactDto): Promise<{
        id: any;
        name: any;
        phoneNumber: any;
        relationship: any;
        isPrimary: any;
        notifyOnEmergency: any;
        createdAt: any;
        updatedAt: any;
    }>;
    deleteContact(userId: string, contactId: string): Promise<void>;
    setPrimaryContact(userId: string, contactId: string): Promise<{
        id: any;
        name: any;
        phoneNumber: any;
        relationship: any;
        isPrimary: any;
        notifyOnEmergency: any;
        createdAt: any;
        updatedAt: any;
    }>;
    getContactsForNotification(userId: string): Promise<any[]>;
    private formatContact;
}
