import {
  SetStateAction,
  useEffect,
  useRef,
  useState
} from "react";

import { IDynamicFilterPartition } from "../../../interfaces/IFilters";

import {
  SelectAllCheckBox,
  OptionCheckBox,
  FilterSelectAllOption,
  FilterButton,
  FilterContainer,
  FilterCounter,
  FilterIcon,
  FilterSimpleList,
  FilterSimpleListClosed,
  FilterListOption
} from "../../../styles";


export const DynamicFilter: React.FC<{
  name: string,
  filters: IDynamicFilterPartition,
  changeFilter: React.Dispatch<SetStateAction<IDynamicFilterPartition>>,
  deactivated?: boolean
}> = ({
  name,
  filters,
  changeFilter,
  deactivated
}) => {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [counter, _setCounter] = useState<number>(0);
    const filterContainerRef = useRef<HTMLDivElement>(null);

    const toggleFilter = (container: string, key: string) => {
      changeFilter(prevFilters => {
        const newCondition = !prevFilters[container][key].condition;

        return {
          ...prevFilters,
          [container]: {
            ...prevFilters[container],
            [key]: {
              ...prevFilters[container][key],
              condition: newCondition
            }
          }
        };
      });

    }

    const toggleAllFilters = (key: any) => {
      changeFilter(prevFilters => {
        const allTrue = Object.values(prevFilters[key]).every(item => item.condition);

        const updatedFilters = Object.keys(prevFilters[key]).reduce((acc, itemKey) => {
          acc[itemKey] = {
            ...prevFilters[key][itemKey],
            condition: !allTrue
          };
          return acc;
        }, {} as { [key: string]: any, condition: boolean });

        return {
          ...prevFilters,
          [key]: updatedFilters
        };
      });
    };

    const handleClickOutside = (event: any) => {
      if (filterContainerRef.current && !filterContainerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleOpenDropDown = () => {
      if (Object.keys(filters).length > 0){
        setIsOpen(!isOpen)
      }
      else {setIsOpen(false)}
    }

    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    return (
      <FilterContainer ref={filterContainerRef}>
        <FilterIcon>
          <i className="fa-solid fa-filter"></i>
        </FilterIcon>
        <input className="FilterInput" disabled={true} type="text" placeholder={name} />
        <FilterButton onClick={() => handleOpenDropDown()}>
          {counter > 0 ? <FilterCounter>{counter}</FilterCounter> : ""}
          {isOpen ? <i className="fa-solid fa-caret-up"></i> : <i className="fa-solid fa-caret-down"></i>}
        </FilterButton>

        {!deactivated && (
          isOpen ? (
            <FilterSimpleList>
              {Object.keys(filters).map((container, container_index) => (
                <div className="box-container" key={`container-${container_index}`}>
                  <FilterSelectAllOption>
                    <label>
                      <input
                        type="checkbox"
                        onChange={() => toggleAllFilters(container)}
                      />
                      <SelectAllCheckBox className="custom-checkbox"></SelectAllCheckBox>
                      <span className="span-container">{container}</span>
                    </label>
                  </FilterSelectAllOption>

                  <div>
                    {Object.keys(filters[container]).map((option, optionIdx) => (
                      <FilterListOption key={`option-${container_index}-${optionIdx}`}>
                        <label>
                          <input
                            type="checkbox"
                            checked={filters[container][option].condition}
                            onChange={() => toggleFilter(container, option)}
                          />
                          <OptionCheckBox className="custom-checkbox"></OptionCheckBox>
                          <span className="span-container">{Object.keys(filters[container])[optionIdx]}</span>
                        </label>
                      </FilterListOption>
                    ))}
                  </div>
                </div>
              ))}
            </FilterSimpleList>
          ) : <FilterSimpleListClosed />
        )}
      </FilterContainer >
    )
  }