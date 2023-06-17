import { createContext } from "react";
import { typingInitialState } from "./typingReducer";
import { $typing } from "../api/types";

export const typingContext = createContext<$typing>(typingInitialState);

