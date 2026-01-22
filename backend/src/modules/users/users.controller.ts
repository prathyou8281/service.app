import { Body, Controller, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users') // ❗ NO "api" here
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('profile')
  updateProfile(@Body() body: UpdateProfileDto & { id: number }) {
    const { id, name, phone } = body;
    return this.usersService.updateProfile(id, { name, phone });
  }
}
