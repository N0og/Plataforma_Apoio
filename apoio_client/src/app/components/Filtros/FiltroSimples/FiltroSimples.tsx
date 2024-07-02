import { SetStateAction, useEffect, useRef, useState } from "react";
import './FiltroSimples.css'


export const FiltroSimples: React.FC<{ name: string, filters: any[], changeFilter: React.Dispatch<SetStateAction<any[]>> }> = ({ name, filters, changeFilter }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);
  const filterContainerRef = useRef<HTMLDivElement>(null);

  const toggleFilter = (index: number, key: string) => {

    changeFilter(prevFilters => prevFilters.map((filters, idx) =>
      idx === index ? { ...filters, [key]: !filters[key] } : filters
    ));

    const isActive = !filters[index][key];
    setCounter(prevCounter => isActive ? prevCounter + 1 : prevCounter - 1);
  }

  const toggleAllFilters = () => {
    changeFilter(prevFilters => {
      const allTrue = prevFilters.every(filter => Object.values(filter).every(value => value === true));

      if (allTrue) {

        setCounter(0)
      }
      else {

        setCounter(filters.length)
      }

      return prevFilters.map(filter => {
        const newFilter: { [key: string]: boolean } = {};
        for (let key in filter) {
          newFilter[key] = !allTrue;
        }
        return newFilter;
      });
    });
  };

  const handleClickOutside = (event:any) => {
    if (filterContainerRef.current && !filterContainerRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="s_filter-container" ref={filterContainerRef}>
      <div className="filterIcon">
        <i className="fa-solid fa-filter"></i>
      </div>
      <input className="inputSelect" disabled={true} type="text" placeholder={name} />
      <button className="openFilters" onClick={() => setIsOpen(!isOpen)}>
        {counter > 0 ? <div className="counter-filter">{counter}</div> : ""}
        {isOpen ? <i className="fa-solid fa-caret-up"></i> : <i className="fa-solid fa-caret-down"></i>}
      </button>

      <div className={isOpen ? "filters" : "filtersClosed"}>
        <div className="filter-all" key={`filter-option-0000-0000`}>
          <label >
            <input
              type="checkbox"
              onChange={() => toggleAllFilters()}
            />
            <label className="custom-checkbox"></label>
            <span className="span-container">SELECIONAR TUDO</span>
          </label>
        </div>
        {
          Object.keys(filters).map((_, index) =>
            Object.keys(filters[index]).map((option, optionIndex) => (
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