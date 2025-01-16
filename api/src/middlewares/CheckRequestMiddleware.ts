import {
    Response,
    NextFunction
} from "express";
import {
    ConnEASRepository,
    ConneSUSRepository,
    municipioRepository
} from "../database/repository/API_DB_Repositorys";
import { IReportControllerRequest } from "../interfaces";

/**
 * Middleware para verificar e configurar o tipo de banco de dados e os parâmetros de solicitação relacionados.
 * 
 * Este middleware valida os parâmetros de consulta da requisição, define o repositório adequado
 * com base no tipo de banco de dados especificado e processa outros parâmetros como `order` e `installations`.
 */
export default class CheckRequestMiddleware {

    ConnRepository: typeof ConnEASRepository | typeof ConneSUSRepository | null = null;

    /**
     * Função principal do middleware que é executada em cada solicitação.
     * 
     * @param req - O objeto da solicitação do cliente, que inclui os parâmetros de consulta.
     * @param res - O objeto de resposta, usado para enviar respostas HTTP.
     * @param next - A função `next` que passa o controle para o próximo middleware.
     */
    execute = async (req: IReportControllerRequest, res: Response, next: NextFunction) => {

        // Verifica se os parâmetros obrigatórios (dbtype, download, order) estão presentes na consulta
        const missingProps = ['dbtype', 'download', 'order'].filter(prop => !req.query.hasOwnProperty(prop));
        if (missingProps.length > 0) {
            return res.status(400).json({ msg: 'Solicitação Incorreta: Sintaxe de solicitação malformada' });
        }

        // Define o repositório correto com base no tipo de banco de dados (mdb ou psql)
        const dbType = req.query.dbtype?.toString().toLowerCase();
        switch (dbType) {
            case 'mdb':
                this.ConnRepository = ConnEASRepository;
                req.dbtype = "mdb";
                break;
            case 'psql':
                this.ConnRepository = ConneSUSRepository;
                req.dbtype = "psql";
                break;
            default:
                return res.status(400).json({ msg: 'Driver DB não compatível.' });
        }

        // Define o parâmetro download como false por padrão ou com base na consulta
        req.download = req.query.download?.toString().toLowerCase() === "true" || false;

        // Verifica se o parâmetro order foi fornecido
        if (!req.query.order) {
            return res.status(400).json({ msg: 'Nenhum pedido requisitado.' });
        }

        // Processa o caso especial onde o parâmetro order é "all"
        if (req.query.order.toString().toLowerCase() === 'all') {
            if (req.download) {
                try {
                    // Busca todos os municípios do repositório
                    const municipios = await municipioRepository.find();
                    if (!municipios || municipios.length === 0) {
                        console.error("Nenhum cliente encontrado");
                        return res.status(404).json({ msg: 'Nenhum cliente encontrado.' });
                    }
                    // Mapeia os nomes dos municípios para o parâmetro order
                    req.order = municipios.map(municipio => municipio.no_municipio);
                } catch (error) {
                    console.error("Falha ao buscar municípios", error);
                    return res.status(500).json({ msg: 'Erro ao processar a solicitação.' });
                }
            } else {
                return res.status(400).json({ msg: 'Falha na solicitação' });
            }
        } else {
            // Se order não for "all", converte o parâmetro em um array
            req.order = Array.isArray(req.query.order) ? req.query.order as string[] : [req.query.order as string];
        }

        // Processa o parâmetro installations se presente na consulta
        if (req.query.installations) {
            req.installations = Array.isArray(req.query.installations) ? req.query.installations as string[] : [req.query.installations as string];
        }

        // Passa o controle para o próximo middleware na cadeia
        next();
    }
}
