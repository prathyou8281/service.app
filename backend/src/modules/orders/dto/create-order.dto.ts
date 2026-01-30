import { IsNotEmpty, IsNumber, IsOptional, IsString, IsDecimal } from 'class-validator';

export class CreateOrderDto {
    @IsNotEmpty()
    @IsNumber()
    service_id: number;

    @IsNotEmpty()
    @IsNumber()
    vendor_id: number;

    @IsOptional()
    @IsString()
    user_description?: string;

    @IsNotEmpty()
    @IsNumber()
    total_amount: number;
}
