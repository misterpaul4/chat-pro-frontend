import notiSound from "../../../../public/notification.wav";

export function playNotificationSound() {
  const audio = new Audio(notiSound);
  audio.play();
}

