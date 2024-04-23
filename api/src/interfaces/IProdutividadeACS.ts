export default interface IProdutividadeACS{
    
    distritoId?: number;
    unidadeId?: number;
    equipeId?: number;
    profissionalId?: number;
    micro_area?: number;
    cartao_sus?: string;
    compartilhada?: boolean;
    desfecho?: string;
    tipo_visita?: number;
    cadastro_atualizacao?: number;
    fora_area?: boolean;
    micro_area_temp?: boolean;
    data_inicial: Date;
    data_final: Date;
    RegionalId?: number;

}