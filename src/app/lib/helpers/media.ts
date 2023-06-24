import notiSound from "../../../../public/notification.mp3";

export function playNotificationSound() {
  const audio = new Audio(notiSound);
  audio.play();
}

