import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateContactDto, UpdateContactDto } from './dto/contact.dto';

const MAX_CONTACTS = 5;

@Injectable()
export class ContactsService {
  constructor(private readonly db: DatabaseService) {}

  async getUserContacts(userId: string) {
    const contacts = await this.db.queryMany(
      `SELECT * FROM emergency_contacts
       WHERE user_id = $1
       ORDER BY is_primary DESC, created_at ASC`,
      [userId],
    );

    return contacts.map(this.formatContact);
  }

  async createContact(userId: string, dto: CreateContactDto) {
    // Check contact limit
    const count = await this.db.queryOne<{ count: string }>(
      `SELECT COUNT(*) as count FROM emergency_contacts WHERE user_id = $1`,
      [userId],
    );

    if (parseInt(count?.count || '0') >= MAX_CONTACTS) {
      throw new BadRequestException(`Maximum ${MAX_CONTACTS} contacts allowed`);
    }

    // Check for duplicate phone
    const existing = await this.db.queryOne(
      `SELECT id FROM emergency_contacts WHERE user_id = $1 AND phone_number = $2`,
      [userId, dto.phoneNumber],
    );

    if (existing) {
      throw new BadRequestException('Contact with this phone number already exists');
    }

    const contact = await this.db.mutateOne(
      `INSERT INTO emergency_contacts (user_id, name, phone_number, relationship, is_primary, notify_on_emergency)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, dto.name, dto.phoneNumber, dto.relationship, dto.isPrimary ?? false, dto.notifyOnEmergency ?? true],
    );

    return this.formatContact(contact);
  }

  async updateContact(userId: string, contactId: string, dto: UpdateContactDto) {
    const contact = await this.db.queryOne(
      `SELECT * FROM emergency_contacts WHERE id = $1 AND user_id = $2`,
      [contactId, userId],
    );

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    const fields: string[] = [];
    const values: any[] = [];
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

    const updated = await this.db.mutateOne(
      `UPDATE emergency_contacts SET ${fields.join(', ')}
       WHERE id = $${paramIndex++} AND user_id = $${paramIndex}
       RETURNING *`,
      values,
    );

    return this.formatContact(updated);
  }

  async deleteContact(userId: string, contactId: string) {
    const result = await this.db.query(
      `DELETE FROM emergency_contacts WHERE id = $1 AND user_id = $2`,
      [contactId, userId],
    );

    if (result.rowCount === 0) {
      throw new NotFoundException('Contact not found');
    }
  }

  async setPrimaryContact(userId: string, contactId: string) {
    const contact = await this.db.queryOne(
      `SELECT * FROM emergency_contacts WHERE id = $1 AND user_id = $2`,
      [contactId, userId],
    );

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    // The trigger will handle unsetting other primary contacts
    const updated = await this.db.mutateOne(
      `UPDATE emergency_contacts SET is_primary = true WHERE id = $1 RETURNING *`,
      [contactId],
    );

    return this.formatContact(updated);
  }

  async getContactsForNotification(userId: string) {
    return this.db.queryMany(
      `SELECT * FROM emergency_contacts
       WHERE user_id = $1 AND notify_on_emergency = true
       ORDER BY is_primary DESC`,
      [userId],
    );
  }

  private formatContact(contact: any) {
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
}
