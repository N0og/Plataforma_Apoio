import { Router } from "express";
import ReportController from "./controllers/ReportController";
import DBController from "./controllers/DBController";
import CheckClientMiddleware from "./middlewares/checkClientMiddleware";

export const router = Router();

router.get('/')

//#region Relatórios
router.get('/api/reports/VisitasPrioritarias', new CheckClientMiddleware().execute ,new ReportController().handleVisitaGrupoPrioritario)

router.get('/api/reports/ProdutividadeACS/VisitasPorDia', new CheckClientMiddleware().execute ,new ReportController().handleProdutividadeACS_PorDia)

router.get('/api/reports/ProdutividadeACS/Consolidado', new CheckClientMiddleware().execute ,new ReportController().handleProdutividadeACS_Consolidado)

router.get('/api/reports/ProdutividadeUBS/Consolidado', new CheckClientMiddleware().execute, new ReportController().handleProdutividadeUBS_Consolidado)

router.get('/api/reports/Completude', new CheckClientMiddleware().execute, new ReportController().handleCompletude)

router.get('/api/reports/DuplicadosPEC', new CheckClientMiddleware().execute, new ReportController().handleDuplicadosPEC)
//#endregion

//#region Database

router.post('/api/db/update', new DBController().handleUpdateDb)

//#endregion

