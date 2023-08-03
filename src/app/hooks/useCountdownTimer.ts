import { useEffect, useState } from "react";

interface CountdownHook {
  timer: string;
  start: () => void;
  stop: () => void;
  running: boolean;
}

const secondsToTime: (seconds: number) => string = (seconds) => {
  let hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  let minutes = Math.floor(seconds / 60);
  seconds %= 60;

  let minutesStr = minutes < 10 ? `0${minutes}` : minutes.toString();
  let secondsStr = seconds < 10 ? `0${seconds}` : seconds.toString();

  return `${minutesStr}:${secondsStr}`;
};

const useCountdownTimer: (timeInSeconds: number) => CountdownHook = (
  timeInSeconds = 0
) => {
  const [timer, setTimer] = useState(secondsToTime(timeInSeconds));
  const [running, setRunning] = useState(false);

  let intervalId: number | undefined;

  const stop = (): void => {
    clearInterval(intervalId);
    setRunning(false);
  };

  useEffect(() => {
    return stop;
  }, []);

  const start = (): void => {
    setRunning(true);
    let seconds = timeInSeconds;
    const interval = window.setInterval(() => {
      intervalId = interval;
      seconds -= 1;
      setTimer(secondsToTime(seconds));
      if (seconds === 0) {
        stop();
      }
    }, 1000);
  };

  return { timer, start, stop, running };
};

export default useCountdownTimer;
