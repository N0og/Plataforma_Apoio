import { UserTokensRepository } from "../database/repository/API_DB_Repositorys";
import jwt from "jsonwebtoken";

type JwtPayload = {
    id: string;
};

export class RefreshTokenService {

    async execute(refreshTokenId: string) {
        let id = {}
        let tokenId = await UserTokensRepository.findOneBy({ refreshTokenId });
        if (tokenId){
            let { id } = jwt.verify(tokenId.refresh_token, process.env.JWT_REFRESH_SECRET!) as JwtPayload
            return {id}
        }  
        
        return {id}
    }
}