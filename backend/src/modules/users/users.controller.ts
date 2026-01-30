import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role } from "../../common/enums/role.enum";
import { FileInterceptor } from "@nestjs/platform-express";
import { UseInterceptors, UploadedFile } from "@nestjs/common";
import { diskStorage } from "multer";
import { extname } from "path";

@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.User)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post("upload-avatar")
  @UseInterceptors(FileInterceptor("avatar", {
    storage: diskStorage({
      destination: "./uploads/profiles",
      filename: (req: any, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `user-${req.user.id}-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  async uploadAvatar(@Request() req, @UploadedFile() file: any) {
    const avatarUrl = `/uploads/profiles/${file.filename}`;
    await this.usersService.updateProfile(req.user.id, { avatar: avatarUrl });
    return { url: avatarUrl };
  }

  @Get("profile")
  getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.id);
  }

  @Put("profile")
  updateProfile(@Request() req, @Body() body: any) {
    return this.usersService.updateProfile(req.user.id, body);
  }

  @Get("stats")
  getStats(@Request() req) {
    return this.usersService.getStats(req.user.id);
  }

  @Post("request-service")
  requestService(@Request() req, @Body() body: any) {
    return this.usersService.requestService(req.user.id, body);
  }

  @Get("history")
  getMyHistory(@Request() req) {
    return this.usersService.getMyHistory(req.user.id);
  }

  @Put("orders/:id/cancel")
  cancelOrder(@Request() req, @Param("id") id: number, @Body("reason") reason: string) {
    return this.usersService.cancelOrder(req.user.id, id, reason);
  }

  @Put("orders/:id")
  updateOrder(@Request() req, @Param("id") id: number, @Body() data: any) {
    return this.usersService.updateOrder(req.user.id, id, data);
  }
}
