import { UserRepository } from "../database/repository/API_DB_Repositorys";
import { Not } from "typeorm";
import { validateOrReject} from 'class-validator';
import { Request } from "express";
import { UpdateUserDTO } from "../dtos";

type IUpdateRequest = {
    token: string;
    uuid: string;
    nome: string;
    cpf: string;
    email: string;
}

export class UpdateUserService {
    async execute(req: Request): Promise<object | Error> {
        const updateUserReq = req.body as IUpdateRequest;

        // Validando os dados de entrada
        const updateUserDTO = new UpdateUserDTO();
        updateUserDTO.uuid = updateUserReq.uuid;
        updateUserDTO.nome = updateUserReq.nome;
        updateUserDTO.cpf = updateUserReq.cpf;
        updateUserDTO.email = updateUserReq.email;

        try {
            await validateOrReject(updateUserDTO);
        } catch (errors) {
            return new Error("Erro de validação: " + errors);
        }

        const user = await UserRepository.findOneBy({ id: updateUserReq.uuid });
        if (!user) {
            return new Error("Usuário não cadastrado.");
        }

        const existingUser = await UserRepository.findOne({
            where: [
                { id: Not(user.id), email: updateUserReq.email },
                { id: Not(user.id), cpf: updateUserReq.cpf }
            ]
        });

        if (existingUser) {
            if (existingUser.email === updateUserReq.email) {
                return new Error("E-mail já cadastrado no sistema.");
            }
            if (existingUser.cpf === updateUserReq.cpf) {
                return new Error("CPF já cadastrado no sistema.");
            }
        }

        user.nome = updateUserReq.nome || user.nome;
        user.cpf = updateUserReq.cpf || user.cpf;
        user.email = updateUserReq.email || user.email;

        try {
            const updatedUser = await UserRepository.save(user);

            if (!updatedUser) {
                throw new Error("Erro ao atualizar o usuário.");
            }

            return {
                success: true,
                message: "Usuário atualizado com sucesso."
            };
        } catch (error) {
            console.error("Erro ao atualizar o usuário:", error);
            return new Error("Erro interno ao atualizar o usuário.");
        }
    }
}
