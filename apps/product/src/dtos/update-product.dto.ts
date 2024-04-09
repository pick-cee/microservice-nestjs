import { IsNumber, IsOptional, IsString } from "class-validator";


export class UpdateProductDto {
    @IsString()
    @IsOptional()
    productName?: string

    @IsNumber()
    @IsOptional()
    price?: number

    @IsString()
    @IsOptional()
    description?: string

    @IsString()
    @IsOptional()
    productImage?: any
}