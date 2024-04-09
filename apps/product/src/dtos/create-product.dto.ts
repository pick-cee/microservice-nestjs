import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    productName: string

    @IsNumber()
    @IsNotEmpty()
    price: number

    @IsString()
    @IsOptional()
    description?: string

    @IsString()
    @IsOptional()
    productImage?: any
}