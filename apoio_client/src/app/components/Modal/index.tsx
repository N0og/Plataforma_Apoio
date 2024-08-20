import { useTypedSelector } from "../../hooks";
import { CancelButton, ClientList, InstallationsList, ModalBackground, ModalButton, ModalContainer } from "../../styles/ModalStyles";

export const Modal = ({ isOpen, confirmCallback }: { isOpen: boolean; confirmCallback: (confirm: boolean) => void }) => {

    const modal = useTypedSelector(rootReducer => rootReducer.modalReducer)

    if (!isOpen) return null;

    return (
        <ModalBackground>
            <ModalContainer>
                <h3>Tem certeza?</h3>
                <p>{modal.msg}</p>
                <ClientList>
                    {modal.values && Object.keys(modal.values).map((key) => (
                        <>
                        <li className="client" key={key}>{key}</li>
                        <InstallationsList>
                            {modal.values[key].map((value:any)=>(
                                <li className="installation">{value}</li>
                            ))}
                        </InstallationsList>
                        </>
                    ))}
                </ClientList>
                <div>
                    <ModalButton onClick={() => confirmCallback(true)}>Confirmar</ModalButton>
                    <CancelButton onClick={() => confirmCallback(false)}>Cancelar</CancelButton>
                </div>
            </ModalContainer>
        </ModalBackground>
    );
}