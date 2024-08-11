import { Style, Workbook, WorkbookOption, Worksheet, WorksheetOption} from 'excel4node';

export class WorkbookConfig implements WorkbookOption {
    jszip: {
        compression: 'DEFLATE',
    };
    defaultFont: {
        size: 11,
        name: 'Arial',
        color: 'FFFFFFFF',
    };
    dateFormat: 'dd/mm/yyyy';
    workbookView: {
        activeTab: 1,
        autoFilterDateGrouping: true,
        firstSheet: 1,
        minimized: false,
        showHorizontalScroll: true,
        showSheetTabs: true,
        showVerticalScroll: true,
        tabRatio: 600,
        visibility: 'visible',
        windowHeight: 17620,
        windowWidth: 28800,
        xWindow: 0,
        yWindow: 440,
    };
    logLevel: 0;
    author: 'Novetech Apoio API';

}


export class WorksheetConfig implements WorksheetOption{
    //Se necessário.
}

export class styles{

    static top: Style = {
        font:{
            bold: true,
            size: 36
        },
        alignment:{
            horizontal: 'center',
            vertical: 'center'
        }
    }

    static header: Style = {
        fill:{
            type: "pattern",
            patternType: "solid",
            bgColor:"#ADADAD",
            fgColor:"#ADADAD"
        }, 
        font:{
            bold: true,
            size: 12
        },
        alignment:{
            horizontal: 'center',
            vertical: 'center'
        }
    }

    static numbers: Style = {
        alignment:{
            horizontal: 'center',
            vertical: 'center'
        }
    }


}