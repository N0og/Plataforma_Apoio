import { SearchButtonContainer } from "../../styles"

export const SearchButton: React.FC<{handleSearchAction: Function}> = ({handleSearchAction}) => {

    return (
        <SearchButtonContainer>
            <button
                onClick={() => { handleSearchAction() }}
            >Buscar</button>
        </SearchButtonContainer>
    )
}