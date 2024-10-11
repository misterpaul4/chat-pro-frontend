import { createContext } from "react";
import { TCallStatus } from "../../../app/lib/types/peertypes";

export interface ICallState {
  status: TCallStatus
  makeCall: (remotePeerId: string) => void
}

const initialValue: ICallState = {
  makeCall: (v: string) => { },
  status: 'Idle'
};


const callContext = createContext(initialValue);

export default callContext
