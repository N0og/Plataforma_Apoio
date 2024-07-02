import { SetStateAction, useEffect, useRef, useState } from "react";
import './FiltroDinamico.css'

interface FilterCompose {
  id: number;
  unidade: string;
  checked: boolean;
}

interface Filter {
  [key: string]: FilterCompose[];
}


export const FiltroDinamico: React.FC<{ name: string, filter: any[], changeFilter: React.Dispatch<SetStateAction<any[]>> }> = ({ name, filter, changeFilter: _changeFilter }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [counter, _setCounter] = useState<number>(0);
  const filterContainerRef = useRef<HTMLDivElement>(null);

  const toggleFilter = (index: number, option: FilterCompose) => {
    _changeFilter((prevFilters: Filter[]) =>
      prevFilters.map((filter, idx) => {
        if (idx === index) {
          const key = Object.keys(filter)[0];
          if (key) {
            const updatedFilter = {
              [key]: filter[key].map((item: FilterCompose) => {
                if (item.id === option.id) {
                  return { ...item, checked: !item.checked };
                }
                return item;
              })
            };
            return updatedFilter;
          }
        }
        return filter;
      })
    );
  };


  const toggleAllFilters = (idx: number) => {
    _changeFilter(prevFilters => {
      const allTrue = prevFilters.every((filter, index) => {
        if (index === idx) {
          const key = Object.keys(filter)[0];
          return filter[key].every((item: FilterCompose) => item.checked);
        }
        return true;
      });


      return prevFilters.map((filter, index) => {
        if (index === idx) {
          const key = Object.keys(filter)[0];
          const updatedFilter = {

            [key]: filter[key].map((item: FilterCompose) => {

              return {
                ...item,
                checked: !allTrue
              }

            })
          };
          return updatedFilter;
        }
        return filter;
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
    <div className="d_filter-container" ref={filterContainerRef}>
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
          filter.map((box, boxIdx) => (
            <div className="box-container" key={`box-${boxIdx}`}>
              <div className="h1-container">
                <label>
                  <input type="checkbox"
                    onChange={() => toggleAllFilters(boxIdx)} />
                  <label className="custom-checkbox"></label>
                  <span className="span-container">{Object.keys(box)[0]}</span>
                </label>
              </div>

              <div>
                {box[Object.keys(box)[0]].map((option: FilterCompose, optionIdx: number) => (
                  <div className="filter-option" key={`option-${boxIdx}-${optionIdx}`}>
                    <label>
                      <input
                        type="checkbox"
                        checked={option.checked}
                        onChange={() => toggleFilter(boxIdx, option)}
                      />
                      <label className="custom-checkbox"></label>
                      <span className="span-container">{option.unidade}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))
        }
      </div>

    </div>
  )
}