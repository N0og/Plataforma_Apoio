export interface IDynamicFilterPartition {
    [key: string]: {[key: string]: { [key: string]: boolean } };
  }
  
  export interface ISimpleFilterPartition {
    [key: string]: boolean ;
  }