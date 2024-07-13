import { Icon } from "leaflet"

const greenIcon = new Icon({
    iconUrl: "marker_green.png",
    iconSize: [52, 52]
})

const redIcon = new Icon({
    iconUrl: "marker_red.png",
    iconSize: [52, 52]
})

const yellowIcon = new Icon({
    iconUrl: "marker_yellow.png",
    iconSize: [52, 52]
})

export const getIcon = (municipio: any) => {
    if (municipio.qtd_indi >= municipio.max) {
        return {
            icon: redIcon,
            message: <span><br /><span style={{ fontWeight: "bold" }}>ATENÇÃO!</span><br />Esta equipe está acima do limite máximo estipulado.</span>,
            qtd_ind: <span style={{ fontWeight: "bold", color: "red" }}>{municipio.qtd_indi}</span>,
            status: "red"
        };
    } else if (municipio.qtd_indi > municipio.param) {
        return {
            icon: greenIcon,
            message: <span><br /><span style={{ fontWeight: "bold" }}>ÓTIMO!</span><br />Esta equipe está dentro dos parâmetros.</span>,
            qtd_ind: <span style={{ fontWeight: "bold", color: "black" }}>{municipio.qtd_indi}</span>,
            status: "green"
        };
    } else {
        return {
            icon: yellowIcon,
            message: <span><br /><span style={{ fontWeight: "bold" }}>OBSERVAÇÃO!</span><br />Recomendada a alocação mais individuos nesta equipe, caso seja possível.</span>,
            qtd_ind: <span style={{ fontWeight: "bold", color: "#54440f" }}>{municipio.qtd_indi}</span>,
            status: "yellow"
        };
    }
};