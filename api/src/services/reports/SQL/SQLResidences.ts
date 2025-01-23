export class SQL_RESIDENCES_ESUS{
    private SQL_BASE: string = 
    `
    with familias as (
        select 
            tfcd.co_seq_fat_cad_domiciliar
        from tb_fat_cad_domiciliar tfcd 
        left join tb_cds_cad_domiciliar tccd on tccd.co_unico_domicilio  = tfcd.nu_uuid_ficha_origem 
        left join tb_fat_cad_dom_familia tfcdf on tfcdf.co_fat_cad_domiciliar = tfcd.co_seq_fat_cad_domiciliar  
        where 
            tfcd.co_dim_tempo_validade > cast(TO_CHAR(CURRENT_DATE, 'yyyymmdd') as INTEGER) 
            and tfcdf.co_dim_tempo_validade > cast(TO_CHAR(CURRENT_DATE, 'yyyymmdd') as INTEGER)
            and tccd.st_versao_atual = 1
            and tfcd.st_familias = 1
            and tfcdf.st_mudou = 0
)
select 
 			tccd.dt_cad_domiciliar  as "Data Cadastro",
 			tdus.no_unidade_saude  as "Estabelecimento",
 			tdus.nu_cnes as "CNES",
 			tde.no_equipe as "Equipe",
 			tde.nu_ine as "INE",
 			tccd.nu_micro_area as "Micro-Area",
 			tccd.nu_domicilio as "Numero do domicilio",
 			tccd.st_recusa_cad as "Recusa",
 			tccd.no_bairro as "Bairro",
 			tccd.no_logradouro as "Logradouro",
 			tccd.ds_complemento as "Complemento",
 			tccd.nu_cep  as "CEP",
 			tccd.nu_fone_residencia as "Telefone",
 			tccd.st_fora_area as "Fora de Área?",
 			tdp.no_profissional as "PROFISSIONAL",
 			tdp.nu_cns as "CNS PROFISSIONAL",
 			case 
 			when tfcd.co_seq_fat_cad_domiciliar in (select * from familias) then 'SIM'
 			else 'NÃO'
 			end as "TEM FAMÍLIA VÍNCULADA?"
        from tb_fat_cad_domiciliar tfcd 
        left join tb_cds_cad_domiciliar tccd on tccd.co_unico_domicilio  = tfcd.nu_uuid_ficha_origem 
        left join tb_dim_unidade_saude tdus on tdus.co_seq_dim_unidade_saude = tfcd.co_dim_unidade_saude 
        left join tb_dim_equipe tde on tde.co_seq_dim_equipe = tfcd.co_dim_equipe
        left join tb_dim_profissional tdp on tdp.co_seq_dim_profissional = tfcd.co_dim_profissional 
        where 
            tfcd.co_dim_tempo_validade > cast(TO_CHAR(CURRENT_DATE, 'yyyymmdd') as INTEGER) 
            and tccd.st_versao_atual = 1
    `
    getBase(){
        return this.SQL_BASE
    }
}

export class SQL_RESIDENCES_EAS{
    private SQL_BASE: string = 
    `
    select 
            	d.DataCadastro as "Data Cadastro",
            	e.Nome as "Estabelecimento",
            	e.cnes as "CNES",
            	eq.nome as "Equipe",
            	eq.id as "INE",
            	d.MicroArea as "Micro-Area",
            	d.Numero as "Numero do domicilio",
            	d.MotivoDaRecusa as "Recusa",
            	b.Nome as "Bairro",
            	ed.Logradouro as "Logradouro",
            	d.Complemento as "Complemento",
            	d.Cep  as "CEP",
            	d.TelefoneResidencial  as "Telefone",
            	d.ForaDeArea as "Fora de Área?",
            	p.Nome as "PROFISSIONAL",
 				p.CartaoSus as "CNS PROFISSIONAL",
            	case
            		when f.id is not null then 'SIM'
            		else 'NÃO'
            	end as "TEM FAMÍLIA VÍNCULADA?"
            from domicilio d
            left join Estabelecimento e on e.id = d.Estabelecimento_Id
            left join Equipe eq on eq.Id = d.CodigoEquipe 
            left join Endereco ed on ed.Id = d.Endereco_Id 
            left join Bairro b on b.Id = ed.Bairro_Id
            left join Familia f on f.Domicilio_Id = d.Id
            left join Profissional p on p.Id = d.Profissional_Id 
            where d.Deletado = 0
    `
    getBase(){
        return this.SQL_BASE
    }
}