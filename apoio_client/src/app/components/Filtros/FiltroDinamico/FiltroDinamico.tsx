import { SetStateAction, useState } from "react";
import './FiltroDinamico.css'


export const FiltroDinamico: React.FC<{ name: string, filter: any[], changeFilter: React.Dispatch<SetStateAction<any[]>> }> = ({ name, filter, changeFilter: _changeFilter }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [counter, _setCounter] = useState<number>(0);


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
          filter.map((municipio) => (
            <div className="box-container">
              <div className="h1-container">
                <label >
                  <input
                    type="checkbox"
                  />
                  <label className="custom-checkbox"></label>
                  <span className="span-container">{Object.keys(municipio)[0]}</span>
                </label>
              </div>

              <div>
                {municipio[Object.keys(municipio)[0]].map((unidade_t: { id: number, unidade: string }) => (
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
            </div>
          ))

        }
      </div>

    </div>
  )
}