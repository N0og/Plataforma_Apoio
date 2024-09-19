import { UserRepository } from "../../database/repository/API_DB_Repositorys";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request } from "express";
import { config as dotenvConfig } from 'dotenv';
import { validateOrReject } from 'class-validator';
import { UpdatePasswordDTO } from "../../dtos";

dotenvConfig();

type UpdatePasswordRequest = {
    token: string;
    uuid: string;
    password: string;
    newPassword: string;
    reNewPassword: string;
}

export class UpdatePasswordService {
    async execute(req: Request): Promise<object | Error> {

        const updatePasswordReq = req.body as UpdatePasswordRequest

        const updatePasswordDTO = new UpdatePasswordDTO();
        updatePasswordDTO.uuid = updatePasswordReq.uuid;
        updatePasswordDTO.password = updatePasswordReq.password;
        updatePasswordDTO.newPassword = updatePasswordReq.newPassword;
        updatePasswordDTO.reNewPassword = updatePasswordReq.reNewPassword;

        try {
            await validateOrReject(updatePasswordDTO);
        } catch (errors) {
            return new Error("Erro de validação: " + errors);
        }

        const user = await UserRepository.findOneBy({ id: updatePasswordReq.uuid });
        if (!user) {
            return new Error("Usuário não encontrado.");
        }

        const isPasswordCorrect = await bcrypt.compare(updatePasswordReq.password, user.password);
        if (!isPasswordCorrect) {
            return new Error("Senha atual incorreta.");
        }

        if (updatePasswordReq.newPassword !== updatePasswordReq.reNewPassword) {
            return new Error("A confirmação de nova senha não coincide.");
        }

        const isSameAsOldPassword = await bcrypt.compare(updatePasswordReq.newPassword, user.password);
        if (isSameAsOldPassword) {
            return new Error("A nova senha não pode ser a mesma que a senha atual.");
        }

        try {
            user.password = await bcrypt.hash(updatePasswordReq.newPassword, 8);
            const updatedUser = await UserRepository.save(user);

            if (!updatedUser) {
                throw new Error("Erro ao atualizar a senha.");
            }

            return {
                success: true,
                message: "Senha atualizada com sucesso."
            };
        } catch (error) {
            console.error("Erro ao atualizar a senha:", error);
            return new Error("Erro interno ao atualizar a senha.");
        }
    }
}
