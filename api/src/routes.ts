import { Router } from "express";
import ReportController from "./controllers/ReportController";
import API_DB_Controller from "./controllers/API_DB_Controller";
import CheckRequestMiddleware from "./middlewares/CheckRequestMiddleware";
import FiltersController from "./controllers/FiltersController";
import MapController from "./controllers/MapController";

// Criação do roteador Express
export const router = Router();

// Rota principal para verificar o status da API
router.get('/', (req, res) => res.send('API is running'));

//#region Relatórios

// Rotas relacionadas aos relatórios, cada uma com um middleware de verificação de requisição
router.get('/api/v1/reports/PRIORITY%20VISITS', new CheckRequestMiddleware().execute, new ReportController().handleVisitaGrupoPrioritario);

router.get('/api/v1/reports/ProdutividadeACS/VisitasPorDia', new CheckRequestMiddleware().execute, new ReportController().handleProdutividadeACS_PorDia);

router.get('/api/v1/reports/ProdutividadeACS/Consolidado', new CheckRequestMiddleware().execute, new ReportController().handleProdutividadeACS_Consolidado);

router.get('/api/v1/reports/TEAM%20PRODUCTIVITY', new CheckRequestMiddleware().execute, new ReportController().handleProdutividadeUBS_Consolidado);

router.get('/api/v1/reports/VACCINES', new CheckRequestMiddleware().execute, new ReportController().handleVacinasPEC);

router.get('/api/v1/reports/COMPLETENESS', new CheckRequestMiddleware().execute, new ReportController().handleCompletude);

router.get('/api/v1/reports/DUPLICATES', new CheckRequestMiddleware().execute, new ReportController().handleDuplicadosPEC);

router.get('/api/v1/reports/AcessosEAS', new CheckRequestMiddleware().execute, new ReportController().handleAcessosRetaguarda);

//#endregion

//#region Database

// Rotas relacionadas a operações no banco de dados
router.post('/api/v1/db/update', new API_DB_Controller().handleUpdateDb);
router.post('/api/v1/db/process', new API_DB_Controller().handleProcessDb);

//#endregion

//#region Filtros

// Rotas relacionadas a filtros para clientes, instalações, unidades, equipes e imunobiológicos
router.get('/api/v1/filters/clients', new FiltersController().handlerClientsFilter);
router.get('/api/v1/filters/instalacoes', new FiltersController().handlerInstalacoesFilter);
router.get('/api/v1/filters/unidades', new FiltersController().handlerUnidadesFilter);
router.get('/api/v1/filters/equipes', new FiltersController().handlerEquipesFilter);
router.get('/api/v1/filters/imunos', new FiltersController().handlerImunosFilter);

//#endregion

//#region Mapas

// Rota relacionada ao mapa IED
router.get('/api/v1/maps/ied', new MapController().handlerIED);

//#endregion
