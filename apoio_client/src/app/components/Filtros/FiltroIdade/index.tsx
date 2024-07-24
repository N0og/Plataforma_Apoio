import { useEffect, useRef, useState } from 'react';
import { FilterButton, FilterContainer, FilterIcon, FilterBirthday, FilterBirthdayClosed, FilterBirthdayOption} from '../../../styles';

export const FiltroIdade: React.FC<{ name: string, deactivated?: boolean }> = ({ name, deactivated }) => {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const filterContainerRef = useRef<HTMLDivElement>(null);

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
        <FilterContainer ref={filterContainerRef}>
            <FilterIcon>
                <i className="fa-solid fa-filter"></i>
            </FilterIcon>
            <input className="FilterInput" disabled={true} type="text" placeholder={name} />
            <FilterButton onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <i className="fa-solid fa-caret-up"></i> : <i className="fa-solid fa-caret-down"></i>}
            </FilterButton>
            {!deactivated ? (
                isOpen ? (
                    <FilterBirthday>
                        <div className='title_input'>
                            <span>DE</span>
                        </div>
                        <FilterBirthdayOption >
                            <input
                                placeholder='ANOS'
                                type="number" />
                            <input
                                placeholder='MESES'
                                type="number" />
                        </FilterBirthdayOption>
                        <div className='title_input'>
                            <span>ATÉ</span>
                        </div>
                        <FilterBirthdayOption>
                            <input
                                placeholder='ANOS'
                                type="number" />
                            <input
                                placeholder='MESES'
                                type="number" />
                        </FilterBirthdayOption>
                    </FilterBirthday>
                    ) : (<FilterBirthdayClosed/>)
                
            ) : null}
        </FilterContainer>
    )
}