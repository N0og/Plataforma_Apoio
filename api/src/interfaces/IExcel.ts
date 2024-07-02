import VisitasPrioritariasOrganizer from "../utils/excel_builder/Organizers/VisitasPrioritariasOrganizer";

export interface IEXCEL_SHEETS{
    [key: string]: {
         excel_builder: any,
         result: any[] }
}