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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactsService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../database/database.service");
const MAX_CONTACTS = 5;
let ContactsService = class ContactsService {
    constructor(db) {
        this.db = db;
    }
    async getUserContacts(userId) {
        const contacts = await this.db.queryMany(`SELECT * FROM emergency_contacts
       WHERE user_id = $1
       ORDER BY is_primary DESC, created_at ASC`, [userId]);
        return contacts.map(this.formatContact);
    }
    async createContact(userId, dto) {
        const count = await this.db.queryOne(`SELECT COUNT(*) as count FROM emergency_contacts WHERE user_id = $1`, [userId]);
        if (parseInt(count?.count || '0') >= MAX_CONTACTS) {
            throw new common_1.BadRequestException(`Maximum ${MAX_CONTACTS} contacts allowed`);
        }
        const existing = await this.db.queryOne(`SELECT id FROM emergency_contacts WHERE user_id = $1 AND phone_number = $2`, [userId, dto.phoneNumber]);
        if (existing) {
            throw new common_1.BadRequestException('Contact with this phone number already exists');
        }
        const contact = await this.db.mutateOne(`INSERT INTO emergency_contacts (user_id, name, phone_number, relationship, is_primary, notify_on_emergency)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`, [userId, dto.name, dto.phoneNumber, dto.relationship, dto.isPrimary ?? false, dto.notifyOnEmergency ?? true]);
        return this.formatContact(contact);
    }
    async updateContact(userId, contactId, dto) {
        const contact = await this.db.queryOne(`SELECT * FROM emergency_contacts WHERE id = $1 AND user_id = $2`, [contactId, userId]);
        if (!contact) {
            throw new common_1.NotFoundException('Contact not found');
        }
        const fields = [];
        const values = [];
        let paramIndex = 1;
        if (dto.name !== undefined) {
            fields.push(`name = $${paramIndex++}`);
            values.push(dto.name);
        }
        if (dto.phoneNumber !== undefined) {
            fields.push(`phone_number = $${paramIndex++}`);
            values.push(dto.phoneNumber);
        }
        if (dto.relationship !== undefined) {
            fields.push(`relationship = $${paramIndex++}`);
            values.push(dto.relationship);
        }
        if (dto.isPrimary !== undefined) {
            fields.push(`is_primary = $${paramIndex++}`);
            values.push(dto.isPrimary);
        }
        if (dto.notifyOnEmergency !== undefined) {
            fields.push(`notify_on_emergency = $${paramIndex++}`);
            values.push(dto.notifyOnEmergency);
        }
        if (fields.length === 0) {
            return this.formatContact(contact);
        }
        fields.push(`updated_at = NOW()`);
        values.push(contactId, userId);
        const updated = await this.db.mutateOne(`UPDATE emergency_contacts SET ${fields.join(', ')}
       WHERE id = $${paramIndex++} AND user_id = $${paramIndex}
       RETURNING *`, values);
        return this.formatContact(updated);
    }
    async deleteContact(userId, contactId) {
        const result = await this.db.query(`DELETE FROM emergency_contacts WHERE id = $1 AND user_id = $2`, [contactId, userId]);
        if (result.rowCount === 0) {
            throw new common_1.NotFoundException('Contact not found');
        }
    }
    async setPrimaryContact(userId, contactId) {
        const contact = await this.db.queryOne(`SELECT * FROM emergency_contacts WHERE id = $1 AND user_id = $2`, [contactId, userId]);
        if (!contact) {
            throw new common_1.NotFoundException('Contact not found');
        }
        const updated = await this.db.mutateOne(`UPDATE emergency_contacts SET is_primary = true WHERE id = $1 RETURNING *`, [contactId]);
        return this.formatContact(updated);
    }
    async getContactsForNotification(userId) {
        return this.db.queryMany(`SELECT * FROM emergency_contacts
       WHERE user_id = $1 AND notify_on_emergency = true
       ORDER BY is_primary DESC`, [userId]);
    }
    formatContact(contact) {
        return {
            id: contact.id,
            name: contact.name,
            phoneNumber: contact.phone_number,
            relationship: contact.relationship,
            isPrimary: contact.is_primary,
            notifyOnEmergency: contact.notify_on_emergency,
            createdAt: contact.created_at,
            updatedAt: contact.updated_at,
        };
    }
};
exports.ContactsService = ContactsService;
exports.ContactsService = ContactsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], ContactsService);
//# sourceMappingURL=contacts.service.js.map