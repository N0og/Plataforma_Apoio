import { Router } from "express";
import ReportController from "./controllers/ReportController";

export const router = Router();

router.get('/')

router.get('/reports/VisitasPrioritarias', new ReportController().handleVisitaGrupoPrioritario)

router.get('/reports/ProdutividadeACS/VisitasPorDia', new ReportController().handleProdutividadeACS_Consolidado)

router.get('/reports/ProdutividadeACS/Consolidado', new ReportController().handleProdutividadeACS_Consolidado)

router.get('/reports/ProdutividadeUBS/Consolidado', new ReportController().handleProdutividadeUBS_Consolidado)