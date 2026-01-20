import { IsNumber, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBookingDto {
    @IsNumber()
    service_id: number;

    @IsString()
    @IsNotEmpty()
    description: string;
}

export class AssignTechnicianDto {
    @IsNumber()
    technician_id: number;
}

export class UpdateJobStatusDto {
    @IsString()
    @IsNotEmpty()
    status: string; // pending, in_progress, completed

    @IsString()
    @IsOptional()
    notes?: string;
}
