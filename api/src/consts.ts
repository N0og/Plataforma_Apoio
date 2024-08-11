import path from 'path';

// Define o caminho principal do diretório atual
export const MAIN_PATH = __dirname;

/**
 * Define o caminho completo para o diretório 'json' dentro da pasta 'config'.
 * Este diretório é utilizado para armazenar arquivos JSON de configuração.
 * 
 * O caminho é construído combinando o caminho principal (MAIN_PATH) com os diretórios 'config' e 'json'.
 */
export const JSON_PATH = path.join(MAIN_PATH, 'config', 'json');
