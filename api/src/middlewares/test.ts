import { Request, Response, NextFunction } from "express";

export const testemiddleware = async (req:Request, res:Response, next:NextFunction) => {
        console.log("AQUI")
    }
