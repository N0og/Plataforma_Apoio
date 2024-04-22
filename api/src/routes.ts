import { Router } from "express";
import ReportController from "./controllers/ReportController";

export const router = Router();

router.get('/')

router.get('/VisitasPrioritarias', new ReportController().handleVisitaGrupoPrioritario)

