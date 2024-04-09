import {
    IsEmail,
    IsPhoneNumber,
    IsString,
    IsNotEmpty,
    IsOptional
} from 'class-validator';

export class CreateUserRequest {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsOptional()
    password?: string

    @IsPhoneNumber()
    @IsNotEmpty()
    phoneNumber: string;
}