  
  export interface ISimpleFilterPartition {
    [key: string]: {[key: string]: any, condition: boolean};
  }

  export interface IDynamicFilterPartition {
    [key: string]: {[key: string]: {value:any, condition: boolean}};
  }