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

  // blocked contact list
  blockedContactListVisibility: boolean;
  onBlockedContactListOpen: () => void;
  onBlockedContactListClose: () => void;
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
  // blocked contact list
  blockedContactListVisibility: false,
  onBlockedContactListOpen: () => undefined,
  onBlockedContactListClose: () => undefined,
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

  const [blockedContactListVisibility, setBlockedContactListVisibility] =
    useState(initialValue.blockedContactListVisibility);

  const onBlockedContactListOpen = () => setBlockedContactListVisibility(true);
  const onBlockedContactListClose = () =>
    setBlockedContactListVisibility(false);

  return (
    <headerContext.Provider
      value={{
        newChatVisibility,
        onNewChatModalOpen,
        onNewChatModalClose,
        onContactListClose,
        onContactListOpen,
        contactListVisibility,
        blockedContactListVisibility,
        onBlockedContactListClose,
        onBlockedContactListOpen,
      }}
    >
      {children}
    </headerContext.Provider>
  );
};

export default headerContext;

