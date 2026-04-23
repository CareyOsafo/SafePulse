import { ContactsService } from './contacts.service';
import { AuthenticatedUser } from '../../auth/auth.service';
import { CreateContactDto, UpdateContactDto } from './dto/contact.dto';
export declare class ContactsController {
    private readonly contactsService;
    constructor(contactsService: ContactsService);
    getContacts(user: AuthenticatedUser): Promise<{
        id: any;
        name: any;
        phoneNumber: any;
        relationship: any;
        isPrimary: any;
        notifyOnEmergency: any;
        createdAt: any;
        updatedAt: any;
    }[]>;
    createContact(user: AuthenticatedUser, dto: CreateContactDto): Promise<{
        id: any;
        name: any;
        phoneNumber: any;
        relationship: any;
        isPrimary: any;
        notifyOnEmergency: any;
        createdAt: any;
        updatedAt: any;
    }>;
    updateContact(user: AuthenticatedUser, contactId: string, dto: UpdateContactDto): Promise<{
        id: any;
        name: any;
        phoneNumber: any;
        relationship: any;
        isPrimary: any;
        notifyOnEmergency: any;
        createdAt: any;
        updatedAt: any;
    }>;
    deleteContact(user: AuthenticatedUser, contactId: string): Promise<void>;
    setPrimary(user: AuthenticatedUser, contactId: string): Promise<{
        id: any;
        name: any;
        phoneNumber: any;
        relationship: any;
        isPrimary: any;
        notifyOnEmergency: any;
        createdAt: any;
        updatedAt: any;
    }>;
}
