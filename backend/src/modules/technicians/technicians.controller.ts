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
import { TechniciansService } from "./technicians.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role } from "../../common/enums/role.enum";
import { FileInterceptor } from "@nestjs/platform-express";
import { UseInterceptors, UploadedFile } from "@nestjs/common";
import { diskStorage } from "multer";
import { extname } from "path";

@Controller("technicians")
export class TechnicianController {
    constructor(private readonly technicianService: TechniciansService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Technician)
    @Post("upload-avatar")
    @UseInterceptors(FileInterceptor("avatar", {
        storage: diskStorage({
            destination: "./uploads/profiles",
            filename: (req: any, file, cb) => {
                const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                cb(null, `tech-${req.user.id}-${uniqueSuffix}${ext}`);
            },
        }),
    }))
    async uploadAvatar(@Request() req, @UploadedFile() file: any) {
        const avatarUrl = `/uploads/profiles/${file.filename}`;
        await this.technicianService.updateProfile(req.user.id, { avatar: avatarUrl });
        return { url: avatarUrl };
    }

    @Post("register")
    register(@Body() body: any) {
        return this.technicianService.register(body);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Technician)
    @Get("profile")
    getProfile(@Request() req) {
        return this.technicianService.getProfile(req.user.id);
    }

    @Put("profile")
    updateProfile(@Request() req, @Body() body: any) {
        return this.technicianService.updateProfile(req.user.id, body);
    }

    @Get("stats")
    getStats(@Request() req) {
        return this.technicianService.getStats(req.user.id);
    }

    @Get("jobs")
    getAssignedJobs(@Request() req) {
        return this.technicianService.getAssignedJobs(req.user.id);
    }

    @Put("jobs/:id/status")
    updateJobStatus(
        @Request() req,
        @Param("id") id: number,
        @Body("status") status: string,
        @Body("notes") notes?: string
    ) {
        return this.technicianService.updateJobStatus(req.user.id, id, status, notes);
    }
}
