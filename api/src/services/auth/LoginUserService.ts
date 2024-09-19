import { UserRepository, UserTokensRepository } from "../../database/repository/API_DB_Repositorys";
import { validateOrReject } from 'class-validator';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config as dotenvConfig } from 'dotenv';
import { LoginRequestDTO } from "../../dtos";
import { Request } from "express";

dotenvConfig();

type ILoginRequest = {
    email: string;
    password: string;
}

export class LoginService {
    async execute(req: Request) {
        const loginAuthRequest = req.body as ILoginRequest
        try {
            const loginRequest = new LoginRequestDTO();
            loginRequest.email = loginAuthRequest.email;
            loginRequest.password = loginAuthRequest.password;

            await validateOrReject(loginRequest);

            const JWT_SECRET = process.env.JWT_SECRET
            const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET
            const JWT_EXPIRATION = parseInt(process.env.JWT_EXPIRATION || '3600');
            const JWT_REFRESH_EXPIRATION = parseInt(process.env.JWT_REFRESH_EXPIRATION || '3600');

            if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
                return new Error("Configurações de JWT não encontradas.");
            }

            const user = await UserRepository.findOneBy({ email: loginAuthRequest.email });

            if (!user || !(await bcrypt.compare(loginAuthRequest.password, user.password))) {
                return new Error("Credenciais inválidas.");
            }

            const token = jwt.sign({ sub: user.id }, JWT_SECRET, {
                algorithm: 'HS512',
                expiresIn: JWT_EXPIRATION
            });

            const refreshToken = jwt.sign({ sub: user.id }, JWT_REFRESH_SECRET, {
                algorithm: 'HS512',
                expiresIn: JWT_REFRESH_EXPIRATION
            });

            const expirationDate = new Date(Date.now() + JWT_REFRESH_EXPIRATION * 1000);

            let userToken = await UserTokensRepository.findOneBy({ user_id: user.id });

            if (userToken) {
                userToken.refresh_token = refreshToken;
                userToken.expires_date = expirationDate;
                await UserTokensRepository.save(userToken);
            } else {
                await UserTokensRepository.insert({
                    refresh_token: refreshToken,
                    user_id: user.id,
                    expires_date: expirationDate
                });
            }

            const userWithoutSensitiveInfo = {
                id: user.id,
                email: user.email,
                nome: user.nome
            };

            return {
                user: userWithoutSensitiveInfo,
                token,
                refresh_token: userToken?.id
            };

        } catch (error) {
            console.error("Erro no serviço de login:", error);
            return new Error("Erro no processo de autenticação.");
        }
    }
}
