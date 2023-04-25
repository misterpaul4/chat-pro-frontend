import { createContext, useState } from "react";

interface IContext {
  visibility: boolean;
  onModalOpen: () => void;
  onModalClose: () => void;
}

const initialValue: IContext = {
  visibility: false,
  onModalOpen: () => undefined,
  onModalClose: () => undefined,
};

const headerContext = createContext(initialValue);

export const HeaderProvider = ({ children }) => {
  const [visibility, setVisibilty] = useState(initialValue.visibility);

  const onModalOpen = () => setVisibilty(true);
  const onModalClose = () => setVisibilty(false);

  return (
    <headerContext.Provider value={{ visibility, onModalOpen, onModalClose }}>
      {children}
    </headerContext.Provider>
  );
};

export default headerContext;

