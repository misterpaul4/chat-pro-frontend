import { useEffect } from "react";
import { toggleDarkMode } from "../../modules/auth/control/userSlice";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";

const useThemeEffect = (dispatch: Dispatch<AnyAction>) => {
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      document.documentElement.style.setProperty("color-scheme", "light dark");
      dispatch(toggleDarkMode(e.matches));
    };

    dispatch(toggleDarkMode(mediaQuery.matches));

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);
};

export default useThemeEffect;

