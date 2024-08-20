import { UserRepository } from "../database/repository/API_DB_Repositorys";
import bcrypt from "bcrypt";
import { Request } from "express";
import { validateOrReject } from 'class-validator';
import { RegisterDTO } from "../dtos";

type RegisterRequest = {
    nome: string;
    cpf: string;
    email: string;
    password: string;
    repassword: string;
}

export class RegisterService {
    async execute(req: Request): Promise<object | Error> {
        const regRequest = req.body as RegisterRequest;

        const registerDTO = new RegisterDTO();
        registerDTO.nome = regRequest.nome;
        registerDTO.cpf = regRequest.cpf;
        registerDTO.email = regRequest.email;
        registerDTO.password = regRequest.password;
        registerDTO.repassword = regRequest.repassword;

        try {
            await validateOrReject(registerDTO);
        } catch (errors) {
            return new Error("Erro de validação: " + errors);
        }

        const existingUser = await UserRepository.findOne({
            where: [{ email: regRequest.email }, { cpf: regRequest.cpf }]
        });

        if (existingUser) {
            if (existingUser.email === regRequest.email) {
                return new Error("E-mail já cadastrado no sistema.");
            }
            if (existingUser.cpf === regRequest.cpf) {
                return new Error("CPF já cadastrado no sistema.");
            }
        }

        if (regRequest.password !== regRequest.repassword) {
            return new Error("As senhas não coincidem.");
        }

        const password_hash = await bcrypt.hash(regRequest.password, 8);

        try {
            const register = await UserRepository.insert({
                name: regRequest.nome,
                cpf: regRequest.cpf,
                email: regRequest.email,
                password: password_hash
            });

            if (!register) {
                throw new Error("Erro ao registrar o usuário.");
            }

            return { success: true };
        } catch (error) {
            console.error("Erro no serviço de registro:", error);
            return new Error("Erro ao registrar o usuário.");
        }
    }
}
