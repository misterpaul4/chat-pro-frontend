export const resizeContentHeight = () => {
  const header = document.querySelector(".headerStyle");
  const footer = document.querySelector(".footerStyle");
  const actionHeader = document.querySelector("#action-header");
  const messageContainer = document.getElementById("message-list");

  if (messageContainer) {
    messageContainer.style.height = `calc(100vh - ${
      header!.clientHeight +
      footer!.clientHeight +
      actionHeader!.clientHeight +
      5
    }px)`;
  }
};

