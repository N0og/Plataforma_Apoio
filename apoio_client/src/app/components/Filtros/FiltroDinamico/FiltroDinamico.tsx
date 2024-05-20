import { SetStateAction, useState } from "react";
import './FiltroDinamico.css'
import { IDynamicFilterPartition } from "../../../../interfaces/IFilters";


export const FiltroDinamico: React.FC<{ name: string, filter: any, changeFilter: React.Dispatch<SetStateAction<IDynamicFilterPartition>> }> = ({ name, filter, changeFilter }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);

  const toggleFilter = (boxTitle: string, boxSubTitle: string, option: string) => {
    changeFilter(prevFilters => ({
      ...prevFilters,
      [boxTitle]: {
        ...prevFilters[boxTitle],
        [boxSubTitle]: {
          ...prevFilters[boxTitle][boxSubTitle],
          [option]: !prevFilters[boxTitle][boxSubTitle][option]
        }
      }
    }));

    const isActive = !filter[boxTitle][boxSubTitle][option];
    setCounter(prevCounter => isActive ? prevCounter + 1 : prevCounter - 1);
  }

  return (
    <div className="d_filter-container">
      <div className="filterIcon">
        <i className="fa-solid fa-filter"></i>
      </div>
      <input className="inputSelect" disabled={true} type="text" placeholder={name} />
      <button className="openFilters" onClick={() => setIsOpen(!isOpen)}>
        {counter > 0 ? <div className="counter-filter">{counter}</div> : ""}
        {isOpen ? <i className="fa-solid fa-caret-up"></i> : <i className="fa-solid fa-caret-down"></i>}
      </button>

      <div className={isOpen ? "filters" : "filtersClosed"}>
        {
          Object.keys(filter).map((municipio) => (
            <div className="box-container">
              <div className="h1-container">
                <span>{Object.keys(filter[municipio])[0]}</span>
              </div>
              {Object.keys(filter[municipio]).map((unidade)=>(
                <div>  
                  {filter[municipio][unidade].map((unidade_t:{id:number, unidade:string})=>(
                    <div className="filter-option" key={`filter-option-0000-0000`}>
                    <label>
                      <input
                        type="checkbox"
                      />
                      <label className="custom-checkbox"></label>
                      <span className="span-container">{unidade_t.unidade}</span>
                    </label>
                  </div>
                  ))}
                </div>
              ))}
            </div>
          ))

        }
      </div>

    </div>
  )
}