import { SearchButtonContainer } from "../../styles"

export const SearchButton: React.FC<{color?: string, title: string, handleSearchAction: Function}> = ({color, title, handleSearchAction}) => {

    return (
        <SearchButtonContainer>
            <button style={{backgroundColor:color}}
                onClick={() => { handleSearchAction() }}
            >{title}</button>
        </SearchButtonContainer>
    )
}