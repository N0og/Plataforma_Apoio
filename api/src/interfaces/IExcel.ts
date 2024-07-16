import VisitasPrioritariasOrganizer from "../utils/excel_builder/Organizers/VisitasPrioritariasOrganizer";

export interface IExcel{
    [key: string]: {
         excel_builder: any,
         result: any[] }
}