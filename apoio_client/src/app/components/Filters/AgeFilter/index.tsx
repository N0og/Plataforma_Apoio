import {
    useEffect,
    useRef,
    useState
} from 'react';

import {
    FilterButton,
    FilterContainer,
    FilterIcon,
    FilterAge,
    FilterAgeClosed,
    FilterAgeOption
} from '../../../styles';

export const AgeFilter: React.FC<{
    name: string,
    deactivated?: boolean
}> = ({
    name,
    deactivated
}) => {
        const [isOpen, setIsOpen] = useState<boolean>(false);
        const filterContainerRef = useRef<HTMLDivElement>(null);

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
                        <FilterAge>
                            <div className='title_input'>
                                <span>DE</span>
                            </div>
                            <FilterAgeOption >
                                <input
                                    placeholder='ANOS'
                                    type="number" />
                                <input
                                    placeholder='MESES'
                                    type="number" />
                            </FilterAgeOption>
                            <div className='title_input'>
                                <span>ATÉ</span>
                            </div>
                            <FilterAgeOption>
                                <input
                                    placeholder='ANOS'
                                    type="number" />
                                <input
                                    placeholder='MESES'
                                    type="number" />
                            </FilterAgeOption>
                        </FilterAge>
                    ) : (<FilterAgeClosed />)

                ) : null}
            </FilterContainer>
        )
    }