import { createContext, useState } from "react";

interface IContext {
  // new chat
  newChatVisibility: boolean;
  onNewChatModalOpen: () => void;
  onNewChatModalClose: () => void;

  // contact list
  contactListVisibility: boolean;
  onContactListOpen: () => void;
  onContactListClose: () => void;
}

const initialValue: IContext = {
  // new chat
  newChatVisibility: false,
  onNewChatModalOpen: () => undefined,
  onNewChatModalClose: () => undefined,
  // contact list
  contactListVisibility: false,
  onContactListOpen: () => undefined,
  onContactListClose: () => undefined,
};

const headerContext = createContext(initialValue);

export const HeaderProvider = ({ children }) => {
  const [newChatVisibility, setNewChatVisibilty] = useState(
    initialValue.newChatVisibility
  );

  const onNewChatModalOpen = () => setNewChatVisibilty(true);
  const onNewChatModalClose = () => setNewChatVisibilty(false);

  const [contactListVisibility, setContactVisibilty] = useState(
    initialValue.contactListVisibility
  );

  const onContactListOpen = () => setContactVisibilty(true);
  const onContactListClose = () => setContactVisibilty(false);

  return (
    <headerContext.Provider
      value={{
        newChatVisibility,
        onNewChatModalOpen,
        onNewChatModalClose,
        onContactListClose,
        onContactListOpen,
        contactListVisibility,
      }}
    >
      {children}
    </headerContext.Provider>
  );
};

export default headerContext;

