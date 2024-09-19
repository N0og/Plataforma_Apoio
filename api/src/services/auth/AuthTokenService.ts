import jwt, { JsonWebTokenError } from "jsonwebtoken"
import { config as dotenvConfig } from 'dotenv'
import { UserRepository } from "../../database/repository/API_DB_Repositorys";
dotenvConfig()

type JwtPayload = {
    id: string;
};

export class AuthTokenService {
    async execute(token: string) {
        try {
            const { id } = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
           
            const user = await UserRepository.findOneBy({ id });
            if (!user) {
                return new Error("Unauthorized");
            }
            const loggedUser = {
                id: user.id,
                email: user.email,
                cpf: user.cpf,
                nome: user.nome
            }
            return loggedUser;
        }
        catch (error) {
            return new Error("Unauthorized");
        }

    }
}