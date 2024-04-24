import { Router } from "express";
import ReportController from "./controllers/ReportController";

export const router = Router();

router.get('/')

//#region Relatórios
router.get('/api/reports/VisitasPrioritarias', new ReportController().handleVisitaGrupoPrioritario)

router.get('/api/reports/ProdutividadeACS/VisitasPorDia', new ReportController().handleProdutividadeACS_PorDia)

router.get('/api/reports/ProdutividadeACS/Consolidado', new ReportController().handleProdutividadeACS_Consolidado)

router.get('/api/reports/ProdutividadeUBS/Consolidado', new ReportController().handleProdutividadeUBS_Consolidado)
//#endregion