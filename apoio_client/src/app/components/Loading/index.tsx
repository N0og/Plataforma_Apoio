import { AlertsEnum } from "../../constants"
import { LoadingComponent, LoadingContainer } from "../../styles/AlertMessageStyles"

export const Loading: React.FC<{Enum: AlertsEnum}> = ({Enum}) => {
    return (
        <LoadingContainer>
            <LoadingComponent></LoadingComponent>
            <span>{Enum}</span>
        </LoadingContainer>
    )
}