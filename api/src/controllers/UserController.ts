import { Request, Response } from "express";
import { LoginService } from "../services/auth/LoginUserService";
import { RegisterService } from "../services/auth/RegisterUserService";
import { UpdateUserService } from "../services/auth/UpdateUserService";
import { UpdatePasswordService } from "../services/auth/UpdatePasswordService";

export default class UserController {
    async handleServiceRequest(req: Request, res: Response, serviceClass: any) {
        try {
            const serviceInstance = new serviceClass();
            const result = await serviceInstance.execute(req);

            if (result instanceof Error) {
                return res.status(400).json({ error: result.message })
            }
            console.log(result)
            return res.json(result)
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro Interno do Servidor." });
        }
    }

     handleLogin = async (req: Request, res: Response) => {
        await this.handleServiceRequest(req, res, LoginService);
    }

    handleRegister = async (req: Request, res: Response) => {
        await this.handleServiceRequest(req, res, RegisterService);
    }

    handleUpdate = async (req: Request, res: Response) => {
        await this.handleServiceRequest(req, res, UpdateUserService);
    }

    handleUpdatePassword = async (req: Request, res: Response) => {
        await this.handleServiceRequest(req, res, UpdatePasswordService);
    }
}
