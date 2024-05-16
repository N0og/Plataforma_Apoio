import { SetStateAction, useState } from "react";
import './FiltroSimples.css'
import { SimpleFilterPartition } from "../../../../interfaces/IFilterPartition";


export const FiltroSimples: React.FC<{ name: string, filters: SimpleFilterPartition[], changeFilter: React.Dispatch<SetStateAction<SimpleFilterPartition[]>> }> = ({ name, filters, changeFilter }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);

  const toggleFilter = (index: number, key: string) => {

    changeFilter(prevFilters => prevFilters.map((filters, idx) => 
      idx === index ? { ...filters, [key]: !filters[key] } : filters
    ));


    const isActive = !filters[index][key];
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

      <div className={isOpen ? "filters" : "filtersClosed"}>
        {
          Object.keys(filters).map((indice, index) =>
            Object.keys(filters[index]).map((option, optionIndex) =>  (
                <div className="filter-option" key={`filter-option-${index}-${optionIndex}`}>
                  <label>
                    <input
                      type="checkbox"
                      id={`checkbox-${index}-${optionIndex}`}
                      checked={filters[index][option]}
                      onChange={() => toggleFilter(index, option)}
                    />
                    <label htmlFor={`checkbox-${index}-${optionIndex}`} className="custom-checkbox"></label>
                    <span className="span-container">{option}</span>
                  </label>
                </div>
              ))
            )
        }
      </div>
    </div>
  )
}