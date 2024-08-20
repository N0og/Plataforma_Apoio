import { useDispatch } from "react-redux"
import { UserActions } from "../../../constants"

export const SubMenu = () => {

    const dispatch = useDispatch()

    const handleclick = () => {
        dispatch({
            type: UserActions.LOGOUT
        })
    }

    return (
        <div className="submenu_top">
            <div className="item_container">
                <div className="item">
                    <button onClick={handleclick}><i className="fa-solid fa-right-to-bracket"></i></button>
                </div>
            </div>
        </div>
    )

}