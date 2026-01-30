import { IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';

export enum OrderStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    ASSIGNED = 'assigned',
    OUT_FOR_DELIVERY = 'out_for_delivery',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    REJECTED = 'rejected',
}

export class UpdateOrderDto {
    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus;

    @IsOptional()
    @IsString()
    technician_description?: string;

    @IsOptional()
    @IsNumber()
    technician_id?: number;
}
