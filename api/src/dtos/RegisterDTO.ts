import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDTO {
    @IsString()
    nome: string;

    @Matches(/^\d{11}$/, { message: "CPF deve conter 11 dígitos." })
    cpf: string;

    @IsEmail({}, { message: "E-mail inválido." })
    email: string;

    @IsString()
    @MinLength(8, { message: "A senha deve ter pelo menos 8 caracteres." })
    password: string;

    @IsString()
    @MinLength(8)
    repassword: string;
}