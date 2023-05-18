import { createContext, useState } from "react";

export const InformationContext = createContext();

export const InformationContextProvider = ({ children, namespace }) => {
    const [showInformationModal, setShowInformationModal] = useState(false);

    const values = {
        showInformationModal,
        setShowInformationModal
    }

    return <InformationContext.Provider value = {values}>{children}</InformationContext.Provider>
}