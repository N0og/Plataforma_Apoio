import { Router } from "express";
import ReportController from "./controllers/ReportController";
import API_DB_Controller from "./controllers/API_DB_Controller";
import CheckDBTypeMiddleware from "./middlewares/CheckDBTypeMiddleware";
import FiltersController from "./controllers/FiltersController";
import MapController from "./controllers/MapController";

export const router = Router();

router.get('/')

//#region Relatórios

router.get('/api/v1/reports/VisitasPrioritarias', new CheckDBTypeMiddleware().execute, new ReportController().handleVisitaGrupoPrioritario)

router.get('/api/v1/reports/ProdutividadeACS/VisitasPorDia', new CheckDBTypeMiddleware().execute, new ReportController().handleProdutividadeACS_PorDia)

router.get('/api/v1/reports/ProdutividadeACS/Consolidado', new CheckDBTypeMiddleware().execute, new ReportController().handleProdutividadeACS_Consolidado)

router.get('/api/v1/reports/ProdutividadeUBS', new CheckDBTypeMiddleware().execute, new ReportController().handleProdutividadeUBS_Consolidado)

router.get('/api/v1/reports/VacinasPEC', new CheckDBTypeMiddleware().execute, new ReportController().handleVacinasPEC)

router.get('/api/v1/reports/Completude', new CheckDBTypeMiddleware().execute, new ReportController().handleCompletude)

router.get('/api/v1/reports/DuplicadosPEC', new CheckDBTypeMiddleware().execute, new ReportController().handleDuplicadosPEC)

router.get('/api/v1/reports/AcessosEAS', new CheckDBTypeMiddleware().execute, new ReportController().handleAcessosRetaguarda)

//#endregion

//#region Database

router.post('/api/v1/db/update', new API_DB_Controller().handleUpdateDb)
router.post('/api/v1/db/process', new API_DB_Controller().handleProcessDb)

//#endregion

//#region Filtros

router.get('/api/v1/filters/clients', new FiltersController().handlerClientsFilter)
router.get('/api/v1/filters/instalacoes', new FiltersController().handlerInstalacoesFilter)
router.get('/api/v1/filters/unidades', new FiltersController().handlerUnidadesFilter)
router.get('/api/v1/filters/equipes', new FiltersController().handlerEquipesFilter)

//#endregion

//#region Filtros

router.get('/api/v1/maps/ied', new MapController().handlerIED)

//#endregion

