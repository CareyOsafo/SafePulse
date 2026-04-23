import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../auth/auth.service';
import { UpdateProfileDto, UpdateSavedPlaceDto } from './dto/user.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile' })
  async getProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getUserProfile(user.id);
  }

  @Post('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  async updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Post('me/device-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update device token for push notifications' })
  @ApiResponse({ status: 200, description: 'Device token updated' })
  async updateDeviceToken(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: { token: string; platform: string },
  ) {
    return this.usersService.updateDeviceToken(user.id, dto.token, dto.platform);
  }

  @Post('me/saved-places/home')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Save home location' })
  @ApiResponse({ status: 200, description: 'Home location saved' })
  async saveHomeLocation(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateSavedPlaceDto,
  ) {
    return this.usersService.updateSavedPlace(user.id, 'home', dto);
  }

  @Post('me/saved-places/work')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Save work location' })
  @ApiResponse({ status: 200, description: 'Work location saved' })
  async saveWorkLocation(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateSavedPlaceDto,
  ) {
    return this.usersService.updateSavedPlace(user.id, 'work', dto);
  }

  @Get('me/saved-places')
  @ApiOperation({ summary: 'Get saved places' })
  @ApiResponse({ status: 200, description: 'Saved places' })
  async getSavedPlaces(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getSavedPlaces(user.id);
  }
}
