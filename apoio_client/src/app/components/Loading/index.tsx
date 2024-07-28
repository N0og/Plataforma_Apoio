import { Alerts } from "../../constants"
import { LoadingComponent, LoadingContainer } from "../../styles"

export const Loading: React.FC<{
    alert: Alerts
}> = ({ alert }) => {
    return (
        <LoadingContainer>
            <LoadingComponent></LoadingComponent>
            <span>{alert}</span>
        </LoadingContainer>
    )
}