import { SetStateAction, useState } from "react";
import './FiltroDinamico.css'
import { DynamicFilterPartition } from "../../../../interfaces/IFilterPartition";


export const FiltroDinamico:React.FC<{name:string, filter:DynamicFilterPartition, changeFilter:React.Dispatch<SetStateAction<DynamicFilterPartition>>}> = ({name, filter, changeFilter}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);
  
  const toggleFilter = (boxTitle:string, boxSubTitle:string, option:string) => {
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
    <div className="filter-container">
      <div className="filterIcon">
        <i className="fa-solid fa-filter"></i>
      </div>
      <input className="inputSelect" disabled={true} type="text" placeholder={name} />
      <button className="openFilters" onClick={() => setIsOpen(!isOpen)}>
        {counter > 0 ? <div className="counter-filter">{counter}</div> : ""}
        {isOpen ? <i className="fa-solid fa-caret-up"></i> : <i className="fa-solid fa-caret-down"></i>}
      </button>
      
        <div className={isOpen?"filters":"filtersClosed"}>
          {
            Object.keys(filter).map((box_title, index) => (
              <div className="box-container">
                <div className="h1-container">
                  <span>{box_title}</span>
                </div>
                {Object.keys(filter[box_title]).map((box_sub_title, index) => (
                  <div>
                    <div className="h2-container">
                      <span>{box_sub_title}</span>
                    </div>
                    {Object.keys(filter[box_title][box_sub_title]).map((option, index) => (
                      <div className="filter-option">
                        <label>
                          <input
                            type="checkbox"
                            id="checkbox "
                            checked={filter[box_title][box_sub_title][option]}
                            onChange={() => toggleFilter(box_title,box_sub_title,option)}
                            
                          />
                          <label htmlFor="checkbox" className="custom-checkbox"></label>
                          <span className="span-container">{option}</span>
                        </label>
                      </div>
                    ))}

                  </div>
                ))
                }

              </div>
            ))
          }
        </div>
      
    </div>
  )
}