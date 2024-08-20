import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDTO {
    @IsString()
    uuid: string;

    @IsString()
    password: string;

    @IsString()
    @MinLength(8, { message: "A nova senha deve ter pelo menos 8 caracteres." })
    newPassword: string;

    @IsString()
    @MinLength(8)
    reNewPassword: string;
}