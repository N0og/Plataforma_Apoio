import { Router } from "express";
import ReportController from "./controllers/ReportController";
import FiltersController from "./controllers/FiltersController";

export const router = Router();

router.get('/')

//#region Relatórios
router.get('/api/reports/VisitasPrioritarias', new ReportController().handleVisitaGrupoPrioritario)

router.get('/api/reports/ProdutividadeACS/VisitasPorDia', new ReportController().handleProdutividadeACS_PorDia)

router.get('/api/reports/ProdutividadeACS/Consolidado', new ReportController().handleProdutividadeACS_Consolidado)

router.get('/api/reports/ProdutividadeUBS/Consolidado', new ReportController().handleProdutividadeUBS_Consolidado)

router.get('/api/reports/Completude', new ReportController().handleCompletude)
//#endregion

//#region filters
router.get('/api/filters/ProdutividadeUBS', new FiltersController().handleFilterUBS)

router.get('/api/filters/ProdutividadeACS', new FiltersController().handleFilterACS)

router.get('/api/filters/VisitasPrioritarias', new FiltersController().handleFilterVisitasPrioritarias)
//#endregion