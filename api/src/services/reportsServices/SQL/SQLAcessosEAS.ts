export class SQL_ACESSOS_EAS{
    private SQL_BASE: string =
    `
        SELECT 
            p.uf,
            p.Cidade,
            u.Nome as USUARIO,   
            u.Perfis as PERFIL,
            EXTRACT(year from a.DataHora) as ANO,
            sum(case when EXTRACT(month from a.DataHora) = 1 then 1 else 0 end) as "MES 1",
            sum(case when EXTRACT(month from a.DataHora) = 2 then 1 else 0 end) as "MES 2",
            sum(case when EXTRACT(month from a.DataHora) = 3 then 1 else 0 end) as "MES 3",
            sum(case when EXTRACT(month from a.DataHora) = 4 then 1 else 0 end) as "MES 4",
            sum(case when EXTRACT(month from a.DataHora) = 5 then 1 else 0 end) as "MES 5",
            sum(case when EXTRACT(month from a.DataHora) = 6 then 1 else 0 end) as "MES 6",
            sum(case when EXTRACT(month from a.DataHora) = 7 then 1 else 0 end) as "MES 7",
            sum(case when EXTRACT(month from a.DataHora) = 8 then 1 else 0 end) as "MES 8",
            sum(case when EXTRACT(month from a.DataHora) = 9 then 1 else 0 end) as "MES 9",
            sum(case when EXTRACT(month from a.DataHora) = 10 then 1 else 0 end) as "MES 10",
            sum(case when EXTRACT(month from a.DataHora) = 11 then 1 else 0 end) as "MES 11",
            sum(case when EXTRACT(month from a.DataHora) = 12 then 1 else 0 end) as "MES 12",
            count(u.Id) as "TOTAL"  
        from Acesso a 
            inner join Usuario u on u.id = a.UsuarioId 
            inner join Prefeitura p on p.Id = u.Prefeitura_Id
        where
            1=1
    `

    private SQL_END: string = 
    `
        group by u.nome
        order by ANO desc
    `

    getBase(){
        return this.SQL_BASE;
    }

    getFrom(){
        return this.SQL_END;
    }
}