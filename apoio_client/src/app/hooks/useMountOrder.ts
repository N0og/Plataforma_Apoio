import { useEffect, useState } from "react";
import { Databases, Pages } from "../constants";
import { IDynamicFilterPartition, ISimpleFilterPartition } from "../interfaces/IFilters";

interface IConfigOrder {
  origin: Pages,
  orders: ISimpleFilterPartition;
  driver: ISimpleFilterPartition;
  params: { [key: string]: IDynamicFilterPartition | ISimpleFilterPartition };
}

const isSimpleFilterPartition = (obj: any) => {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  for (const key in obj) {
    if (typeof obj[key] !== 'object' || obj[key] === null || !('condition' in obj[key])) {
      return false;
    }

    if (typeof obj[key].condition !== 'boolean') {
      return false;
    }
  }

  return true;
}

export const useMountOrder = (config: IConfigOrder, dependencys: React.DependencyList) => {

  const [OrderURL, setOrderParam] = useState<string>("");

  const getDriver = (sources: ISimpleFilterPartition): Databases | undefined => {

    for (let key in sources) {
      if (sources[key].condition === true) {
        return sources[key].value;
      }
    }
    return undefined;
  };

  useEffect(() => {
    let URL = `${process.env.VITE_API_URL}/api/v1/reports/${config.origin}?dbtype=${getDriver(config.driver)}${Object.entries(config.orders)
      .filter(([_key, value]) => value.condition === true)
      .map(([key, _value]) => `&order=${key.replace(/ /g, "%20")}`)
      .join('')}`

    if (Object.keys(config.params).length > 0) {

      Object.entries(config.params).forEach(([FilterTitle, FilterObject]) => {
        if (Object.keys(FilterObject).length > 0) {
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
        }
      });
    }
    setOrderParam(URL)
  }, dependencys)

  return { OrderURL }
}