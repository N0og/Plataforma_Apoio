import { useEffect, useState } from "react";
import { Databases, Pages } from "../constants";
import { IDynamicFilterPartition, ISimpleFilterPartition } from "../interfaces/IFilters";

interface IConfigOrder {
  origin: Pages,
  orders: ISimpleFilterPartition;
  driver: ISimpleFilterPartition;
  params: {[key: string]: IDynamicFilterPartition | ISimpleFilterPartition};
  download: boolean
}

const isSimpleFilterPartition = (obj: any) => {
  return (typeof obj === 'object' &&
    'value' in obj &&
    'condition' in obj)
}

export const useMountOrder = (config: IConfigOrder, dependencys: React.DependencyList) => {

  const [OrderURL, setOrderParam] = useState<string>("");

  const getDriver = (sources: ISimpleFilterPartition): Databases | undefined => {
    for (let key in sources) {
      if (sources[key].condition === true) {
        return sources[key].dbtype;
      }
    }
    return undefined;
  };

  useEffect(() => {
    let URL = `${process.env.VITE_API_URL}/api/v1/reports/${config.origin}?dbtype=${getDriver(config.driver)}&download=${config.download}${Object.entries(config.orders)
      .filter(([_key, value]) => value.condition === true)
      .map(([key, _value]) => `&order=${key.replace(/ /g, "%20")}`)
      .join('')}`
    
    if (Object.keys(config.params).length > 0){
      Object.entries(config.params).forEach(([FilterTitle, FilterObject]) => {
        if (isSimpleFilterPartition(FilterObject)) {
          URL += Object.entries(FilterObject)
            .filter(([_innerKey, innerInnerValue]: [string, any]) => innerInnerValue.condition === true)
            .map(([_innerKey, innerInnerValue]: [string, any]) => `&${FilterTitle}=${innerInnerValue.value}`)
            .join('')
        } else {
          URL += Object.entries(FilterObject)
            .flatMap(([_containerKey, containerValue]) =>
              Object.entries(containerValue)
                .filter(([_key, value]: [string, any]) => value.condition === true)
                .map(([_key, value]: [string, any]) => `&${FilterTitle}=${value.value}`)
            ).join('')
        }
      });
    }
    

    console.log(URL)
    setOrderParam(URL)
  }, dependencys)

  return { OrderURL }
}