import { Router } from "express";
import ReportController from "./controllers/ReportController";
import DBController from "./controllers/DBController";
import CheckClientMiddleware from "./middlewares/checkClientMiddleware";
import FiltersController from "./controllers/FiltersController";
import MapController from "./controllers/MapController";

export const router = Router();

router.get('/')

//#region Relatórios
router.get('/api/v1/reports/VisitasPrioritarias', new CheckClientMiddleware().execute ,new ReportController().handleVisitaGrupoPrioritario)

router.get('/api/v1/reports/ProdutividadeACS/VisitasPorDia', new CheckClientMiddleware().execute ,new ReportController().handleProdutividadeACS_PorDia)

router.get('/api/v1/reports/ProdutividadeACS/Consolidado', new CheckClientMiddleware().execute ,new ReportController().handleProdutividadeACS_Consolidado)

router.get('/api/v1/reports/ProdutividadeUBS/Consolidado', new CheckClientMiddleware().execute, new ReportController().handleProdutividadeUBS_Consolidado)

router.get('/api/v1/reports/Completude', new CheckClientMiddleware().execute, new ReportController().handleCompletude)

router.get('/api/v1/reports/DuplicadosPEC', new CheckClientMiddleware().execute, new ReportController().handleDuplicadosPEC)
//#endregion

//#region Database

router.post('/api/v1/db/update', new DBController().handleUpdateDb)

//#endregion

//#region Filtros

router.get('/api/v1/filters/clients', new FiltersController().handlerClientsFilter)

//#endregion

//#region Filtros

router.get('/api/v1/maps/ied', new MapController().handlerIED)

//#endregion

