import { IsString, IsEmail, Matches } from 'class-validator';

export class UpdateUserDTO {
    @IsString()
    uuid: string;

    @IsString()
    nome: string;

    @Matches(/^\d{11}$/, { message: "O CPF deve ter exatamente 11 dígitos." })
    cpf: string;

    @IsEmail({}, { message: "E-mail inválido." })
    email: string;
}