import { SetStateAction, useEffect, useRef, useState } from "react";
import { useNotifyEvent } from "../../../hooks/useNotifyEvent";
import { ISimpleFilterPartition } from "../../../interfaces/IFilters";
import { CustomCheckBoxAll, CustomCheckBoxOption, FilterAllOption, FilterButton, FilterContainer, FilterCounter, FilterIcon, FilterList, FilterListClosed, FilterListOption } from "../../../styles";

export const FiltroSimples: React.FC<{ name: string, filters: ISimpleFilterPartition, changeFilter: React.Dispatch<SetStateAction<ISimpleFilterPartition>>, deactivated?: boolean }> = ({ name, filters, changeFilter, deactivated }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);
  const filterContainerRef = useRef<HTMLDivElement>(null);

  const toggleFilter = (key: string) => {
    changeFilter(prevFilters => {
      const newCondition = !prevFilters[key].condition;
      return {
        ...prevFilters,
        [key]: {
          ...prevFilters[key],
          condition: newCondition,
        },
      };
    });

    setCounter(prevCounter => filters[key].condition ? prevCounter - 1 : prevCounter + 1);
  }

  const toggleAllFilters = () => {
    changeFilter(prevFilters => {
      const newFilters: any = {};

      const allTrue = Object.values(prevFilters).every(value => value.condition === true);

      if (allTrue) {
        setCounter(0)
      }
      else {
        setCounter(Object.keys(filters).length)
      }

      for (let key in prevFilters) {
        if (prevFilters.hasOwnProperty(key)) {
          newFilters[key] = { ...newFilters[key], condition: !allTrue };
        }
      }
      return newFilters;
    });
  };

  const handleClickOutside = (event: any) => {
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

  useEffect(() => {
    if (isOpen && Object.keys(filters).length == 0) useNotifyEvent('Falha ao Obter Municípios.', 1000, 'error')
  }, [isOpen])

  return (
    <FilterContainer ref={filterContainerRef}>
      <FilterIcon>
        <i className="fa-solid fa-filter"></i>
      </FilterIcon>
      <input className="FilterInput" disabled={true} type="text" placeholder={name} />
      <FilterButton onClick={() => setIsOpen(!isOpen)}>
        {counter > 0 ? <FilterCounter>{counter}</FilterCounter> : ""}
        {isOpen ? <i className="fa-solid fa-caret-up"></i> : <i className="fa-solid fa-caret-down"></i>}
      </FilterButton>
      {!deactivated ? (
        isOpen ? (
          <FilterList>
            <FilterAllOption key={`filter-option-0000-0000`}>
              <label>
                <input
                  type="checkbox"
                  onChange={() => toggleAllFilters()}
                />
                <CustomCheckBoxAll className="custom-checkbox"></CustomCheckBoxAll>
                <span className="span-container">SELECIONAR TUDO</span>
              </label>
            </FilterAllOption>
            {Object.keys(filters).map((option, index) => (
              <FilterListOption key={`filter-option-${index}`}>
                <label>
                  <input
                    type="checkbox"
                    id={`checkbox-${index}`}
                    checked={filters[option].condition}
                    onChange={() => toggleFilter(option)}
                  />
                  <CustomCheckBoxOption htmlFor={`checkbox-${index}`} className="custom-checkbox"></CustomCheckBoxOption>
                  <span className="span-container">{option}</span>
                </label>
              </FilterListOption>
            ))}
          </FilterList>
        ) : (
          <FilterListClosed />
        )
      ) : null}

    </FilterContainer>
  )
}