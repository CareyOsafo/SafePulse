import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../auth/auth.service';
import { CreateContactDto, UpdateContactDto } from './dto/contact.dto';

@ApiTags('contacts')
@ApiBearerAuth()
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all emergency contacts' })
  @ApiResponse({ status: 200, description: 'List of contacts' })
  async getContacts(@CurrentUser() user: AuthenticatedUser) {
    return this.contactsService.getUserContacts(user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new emergency contact' })
  @ApiResponse({ status: 201, description: 'Contact created' })
  @ApiResponse({ status: 400, description: 'Invalid data or contact limit reached' })
  async createContact(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateContactDto,
  ) {
    return this.contactsService.createContact(user.id, dto);
  }

  @Post(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an emergency contact' })
  @ApiResponse({ status: 200, description: 'Contact updated' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async updateContact(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') contactId: string,
    @Body() dto: UpdateContactDto,
  ) {
    return this.contactsService.updateContact(user.id, contactId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an emergency contact' })
  @ApiResponse({ status: 204, description: 'Contact deleted' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async deleteContact(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') contactId: string,
  ) {
    await this.contactsService.deleteContact(user.id, contactId);
  }

  @Post(':id/set-primary')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set contact as primary' })
  @ApiResponse({ status: 200, description: 'Contact set as primary' })
  async setPrimary(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') contactId: string,
  ) {
    return this.contactsService.setPrimaryContact(user.id, contactId);
  }
}
