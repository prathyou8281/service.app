import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ResultSetHeader } from 'mysql2';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    const { name, phone } = dto;

    const result: ResultSetHeader = await this.db.execute(
      `
      UPDATE users
      SET
        name = COALESCE(?, name),
        phone = COALESCE(?, phone),
        updated_at = NOW()
      WHERE id = ?
      `,
      [name, phone, userId],
    );

    if (result.affectedRows === 0) {
      throw new NotFoundException('User not found');
    }

    return { message: 'Profile updated successfully' };
  }
}
