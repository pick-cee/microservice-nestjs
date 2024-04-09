import {
    IsEmail,
    IsOptional,
    IsPhoneNumber,
    IsString,
} from 'class-validator';

export class UpdateUserRequest {
    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsString()
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsPhoneNumber()
    @IsOptional()
    phoneNumber?: string;
}