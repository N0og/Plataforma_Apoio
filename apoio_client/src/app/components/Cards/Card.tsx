import './Card.css'

export const Card:React.FC<{
    icon:string,
    title:string,
    onclick:Function
}> = ({icon, title, onclick} ) => {

    return(
        <div className="card">
            <button onClick={()=>{onclick()}}></button>
            <div className="icon_card"><i className={icon}></i></div>
            <div className="title_card"><span>{title}</span></div>
        </div>
    )
}